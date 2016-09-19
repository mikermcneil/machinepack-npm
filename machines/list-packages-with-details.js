module.exports = {


  friendlyName: 'List packages (detailed)',


  description: 'List matching packages and include metadata from their package.json files.',


  extendedDescription: 'Also includes the raw package.json string as `rawJson`, in case you need to parse additional non-standard metadata.',


  cacheable: true,


  inputs: {

    query: {
      example: 'sails',
      description: 'The search query to send to NPM.',
      extendedDescription: 'This string will be used to search within package keywords.',
      required: true
    }

  },


  exits: {

    success: {
      outputDescription: 'An array of package detail dictionaries for each of the matching NPM packages.',
      example: [
        {
          name: 'browserify',
          description: 'asg',
          version: '0.1.1',
          latestVersionPublishedAt: '2015-01-19T22:26:54.588Z',
          npmUrl: 'http://npmjs.org/package/machinepack-foo',
          sourceUrl: 'https://github.com/baz/machinepack-foo',
          author: 'Substack <substack@substack.com>',
          main: 'lib/index.js',
          license: 'MIT',
          rawJson: '{...package.json data as a JSON string...}',
          keywords: [
            'machine'
          ],
          contributors: [
            { name: 'Substack', email: 'substack@substack.com' }
          ],
          dependencies: [
            { name: 'lodash', semverRange: '^2.4.1' }
          ]
        }
      ]
    }//</success>

  },


  fn: function (inputs, exits){

    var async = require('async');
    var Machine = require('machine');
    var listPackages = Machine.build(require('./list-packages'));
    var fetchInfo = Machine.build(require('./fetch-info'));
    var parsePackageJson = Machine.build(require('./parse-package-json'));


    listPackages({
      query: inputs.query
    }).exec(function (err, npmPackageNames) {
      if (err) { return exits.error(err); }

      // Now expand each module with full results directly
      // from the npm registry.
      var npmModules = [];

      async.each(
        npmPackageNames,

        function iteratee(packageName, next) {

          fetchInfo({
            packageName: packageName
          }).exec(function (err, pkgInfo) {
            if (err) { return next(err); }

            var metadata;
            try {

              var rawJsonStr = JSON.stringify(pkgInfo);

              metadata = parsePackageJson({
                json: rawJsonStr
              }).execSync();

              // Attach raw json string
              metadata.rawJson = rawJsonStr;

            } catch (e){ return next(e); }

            npmModules.push(metadata);

            return next();

          });
        },//</iteratee>

        // ~∞%°
        function afterwards(err) {
          if (err) { return exits.error(err); }
          return exits.success(npmModules);
        }
      );//</async.each>
    });//</listPackages()>
  }


};

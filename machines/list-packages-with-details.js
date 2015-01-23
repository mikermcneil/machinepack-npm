module.exports = {
  friendlyName: 'List packages (detailed)',
  description: 'List matching packages, along with metadata from their package.json files.',
  extendedDescription: '',
  inputs: {
    query: {
      example: 'sails',
      description: 'A string that will be used when querying npm.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {},
    success: {
      example: [{
        name: 'browserify',
        description: 'asg',
        version: '0.1.1',
        keywords: ['machine'],
        latestVersionPublishedAt: '2015-01-19T22:26:54.588Z',
        npmUrl: 'http://npmjs.org/package/machinepack-foo',
        sourceCodeUrl: 'https://github.com/baz/machinepack-foo',
        author: {
          name: 'Substack'
        },
        dependencies: [{
          name: 'lodash',
          semverRange: '^2.4.1'
        }],
        license: 'MIT',
        contributors: [{
          name: 'Substack',
          email: 'substack@substack.com'
        }],
        rawJson: '{...package.json data as a JSON string...}'
      }]
    }
  },
  fn: function (inputs, cb){

    var async = require('async');
    var Machine = require('machine');

    Machine.build(require('./list-packages'))({
      query: inputs.query
    }).exec(function (err, npmPackageNames) {
      if (err) return cb(err);

      // Now expand each module with full results directly
      // from the npm registry.
      var npmModules = [];

      async.each(npmPackageNames, function (packageName, next) {
        Machine.build(require('./get-package-json'))({
          packageName: packageName
        }).exec(function(err, packageJsonString) {
          if (err) return next(err);

          var metadata;
          try {
            metadata = Machine.build(require('./parse-package-json'))({
              json: packageJsonString
            }).execSync();
            // metadata.rawJson = JSON.stringify(_.extend(JSON.parse(packageJsonString), metadata));
            metadata.rawJson = packageJsonString;
          }
          catch (e){
            return next(e);
          }
          npmModules.push(metadata);
          return next();
        });
      }, function (err) {
        if (err) return cb(err);
        return cb(null, npmModules);
      });
    });

  }

};

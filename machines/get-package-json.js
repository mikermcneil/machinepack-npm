module.exports = {

  friendlyName: 'Get package details',

  description: 'Get metadata for the latest version of the NPM package with the specified name.',

  extendedDescription: '',

  inputs: {
    module: {
      example: 'browserify',
      description: 'The unique name of the npm module.',
      required: true
    }
  },

  defaultExit: 'success',

  exits: {
    success: {
      example: {
        name: 'browserify',
        description: 'asg',
        version: '0.1.1',
        keywords: ['machine'],
        author: {
          name: 'Mike McNeil'
        },
        dependencies: [{
          name: 'lodash',
          semverRange: '^2.4.1'
        }],
        license: 'MIT',
        rawJson: '{"name": "browserify", etc.}'
      }
    },
    invalidModule: {
      description: 'NPM module is in an invalid format'
    },
    error: {
      description: 'Unexpected error occurred.'
    },
  },

  fn: function (inputs,exits) {

    var util = require('util');
    var _ = require('lodash');

    require('machinepack-http').sendHttpRequest({
      baseUrl: 'http://registry.npmjs.org',
      url: util.format('/%s', inputs.module)
    }).exec({
      error: function (err) {
        return exits.error(err);
      },
      success: function (response) {
        var moduleMetadata = {};
        var _data;
        try {
          _data = JSON.parse(response.body);
        }
        catch (e) {
          return exits.error('Could not parse unexpected response from registry.npm.org:\n'+util.inspect(response.body, false, null)+'\nBecause '+util.inspect(e, false, null));
        }

        try {
          // Include basic metadata
          moduleMetadata.name = _data._id;
          moduleMetadata.description = _data.description;
          moduleMetadata.keywords = _data.keywords;
          moduleMetadata.version = _data['dist-tags'].latest;
          moduleMetadata.latestVersionPublishedAt = _data.time.modified;
          moduleMetadata.author = _data.author;
          moduleMetadata.license = _data.license;

          // Include the metadata about the latest version
          var latestVersion = _data.versions[moduleMetadata.version];
          moduleMetadata.dependencies = _.reduce(latestVersion.dependencies, function (memo, semverRange, name){
            memo.push({
              name: name,
              semverRange: semverRange
            });
            return memo;
          }, []);

          // console.log(latestVersion);

          // Also include the raw, unparsed JSON
          // moduleMetadata.rawJson = response.body;
        }
        catch (e) {
          return exits.invalidModule(e);
        }

        return exits.success(moduleMetadata);
      }
    });

  },

};

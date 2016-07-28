module.exports = {


  friendlyName: 'Get latest version',


  description: 'Look up the version string for the latest published version of the specified NPM package.',


  extendedDescription: 'This fetches uses information directly from the NPM registry\'s Couch database.',


  cacheable: true,


  inputs: {

    packageName: {
      description: 'The unique name of the NPM package.',
      example: 'browserify',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Latest version',
      outputDescription: 'The version string for the latest published version of the specified package on NPM.',
      example: '1.0.0'
    },

    packageNotFound: {
      description: 'No package exists on the public NPM registry with the specified name.'
    },

    couldNotParse: {
      description: 'The package.json string for the specified package could not be parsed as JSON.'
    }

  },


  fn: function (inputs, exits) {
    var util = require('util');
    var NPM = require('./');

    if (inputs.packageName.match(/^@/)){
      return exits.error(new Error('This machine does not currently support scoped packages (e.g. @mikermcneil/foobar)'));
    }

    NPM.fetchInfo({
      packageName: inputs.packageName
    }).exec({
      error: exits.error,
      packageNotFound: exits.packageNotFound,
      couldNotParse: exits.couldNotParse,
      success: function (npmPackageInfo){

        var latestPublishedVersion;
        try {
          var distTags = npmPackageInfo['dist-tags'];
          if (!_.isObject(distTags)) {
            return exits.couldNotParse(new Error('Missing or invalid `dist-tags` received from NPM.'));
          }
          latestPublishedVersion = distTags.latest;
        } catch (e) { return exits.couldNotParse(e); }

        if (!_.isString(latestPublishedVersion)) {
          return exits.couldNotParse(new Error('Missing or invalid `dist-tags.latest` version string received from NPM (it is claiming that `'+latestPublishedVersion+'` is the latest version of `sails-stdlib`!'));
        }

        return exits.success(latestPublishedVersion);
      }//</•-upon success::NPM.fetchInfo>
    });//</NPM.fetchInfo()>
  }


};

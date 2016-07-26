module.exports = {


  friendlyName: 'Fetch info',


  description: 'Look up information about the latest version of the specified NPM package.',


  extendedDescription: 'This fetches the package.json string for the specified package directly from the NPM registry.',


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
      outputFriendlyName: 'NPM package info',
      outputDescription: 'Information about the specified NPM package, pulled directly from its package.json info in the NPM registry.',
      example: {}
    },

    packageNotFound: {
      description: 'No package exists on the public NPM registry with the specified name.'
    },

    couldNotParse: {
      description: 'The package.json string for the specified package could not be parsed as JSON.'
    }

  },


  fn: function (inputs,exits) {
    var util = require('util');
    var _ = require('lodash');
    var Http = require('machinepack-http');

    if (inputs.packageName.match(/^@/)){
      return exits.error(new Error('This machine does not currently support scoped packages (e.g. @mikermcneil/foobar)'));
    }

    Http.sendHttpRequest({
      baseUrl: 'http://registry.npmjs.org',
      url: util.format('/%s', inputs.packageName)
    }).exec({
      error: function (err) {
        return exits.error(err);
      },
      notFound: function (response) {
        return exits.packageNotFound(response);
      },
      success: function (response) {
        var parsed;
        try { parsed = JSON.parse(response.body); }
        catch (e) { return exits.couldNotParse(e); }

        return exits.success(parsed);
      }
    });
  }


};

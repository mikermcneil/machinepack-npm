module.exports = {


  friendlyName: 'Fetch package metadata',


  description: 'Fetch the package.json string for the specified package from the NPM registry.',


  cacheable: true,


  inputs: {

    packageName: {
      friendlyName: 'Package name',
      example: 'browserify',
      description: 'The unique name of the NPM package.',
      required: true
    }

  },


  exits: {

    success: {
      description: 'Returns a JSON string.',
      variableName: 'packageJsonString',
      example: '{"name": "browserify", etc.}',
    },

    packageNotFound: {
      description: 'No package exists on the public NPM registry with the specified name.'
    }

  },


  fn: function (inputs,exits) {

    var util = require('util');
    var _ = require('lodash');

    if (inputs.packageName.match(/^@/)){
      return exits.error(new Error('This machine does not currently support scoped packages (e.g. @mikermcneil/foobar)'));
    }

    require('machinepack-http').sendHttpRequest({
      baseUrl: 'http://registry.npmjs.org',
      url: util.format('/%s', inputs.packageName)
    }).exec({
      error: function (err) {
        return exits.error(err);
      },
      notFound: function (response) {
        try {
          // Determine whether the 404 status code was returned because the module does not exist.
          if (JSON.parse(response.body).error==='not_found') {
            return exits.packageNotFound();
          }
        }
        catch (e){}
        return exits.error(response);
      },
      success: function (response) {
        return exits.success(response.body);
      }
    });
  }


};

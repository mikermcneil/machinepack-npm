module.exports = {

  friendlyName: 'Get package.json',

  description: 'Get the package.json string for the specified package from the NPM registry.',

  extendedDescription: '',

  inputs: {
    packageName: {
      friendlyName: 'Package name',
      example: 'browserify',
      description: 'The unique name of the NPM package.',
      required: true
    }
  },

  defaultExit: 'success',

  exits: {
    success: {
      description: 'Returns a JSON string.',
      example: '{"name": "browserify", etc.}',
      variableName: 'packageJsonString'
    },
    packageNotFound: {
      description: 'No package exists on the public NPM registry with the specified name.'
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
      url: util.format('/%s', inputs.packageName)
    }).exec({
      error: function (err) {
        return exits.error(err);
      },
      notOk: function (response) {
        try{
          // Determine whether the error code was returned because the module does not exist.
          // (i.e. { status: 404, body: '{"error":"not_found","reason":"document not found"}' })
          if (response.status === 404 && JSON.parse(response.body).error==='not_found') {
            return exits.packageNotFound();
          }
          return exits.error(response);
        }
        catch (e) {
          return exits.error(e);
        }
      },
      success: function (response) {
        return exits.success(response.body);
      }
    });
  },

};

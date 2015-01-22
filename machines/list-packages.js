module.exports = {
  friendlyName: 'List packages',
  description: 'List packages in the public npm registry which match the specified search query.',
  extendedDescription: '',
  inputs: {
    query: {
      example: 'sails-hook-',
      description: 'A string that will be used when querying npm.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    success: {
      example: ['sails-hook-autoreload']
    },
    error: {
      description: 'Unexpected error occurred.'
    }
  },
  fn: function (inputs,exits) {


    // Module dependencies
    var util = require('util');
    var _ = require('lodash');

    //
    // See http://stackoverflow.com/a/13657540/486547
    //
    // The URL ends up being something like:
    // ```
    // https://registry.npmjs.org/-/_view/byKeyword?startkey=[%22sails%22]&endkey=[%22sails%22,{}]&group_level=3
    // ```
    //

    require('machinepack-http').sendHttpRequest({
      baseUrl: 'https://registry.npmjs.org',
      method: 'GET',
      url: '/-/_view/byKeyword',
      params: JSON.stringify({
        startkey: JSON.stringify([inputs.query]),
        endkey: JSON.stringify([inputs.query, {}]),
        group_level: 3
      })
    }, function (err, response) {
      if (err) { return exits.error(err); }

      // Parse response body
      var rows;
      try {
        rows = JSON.parse(response.body).rows;
        if (!_.isArray(rows)) {
          throw new Error(util.format('Expecting array but got %s', util.inspect(response.body, false, null)));
        }
      }
      catch (e) {
        return exits.error('Unexpected response from NPM: '+util.inspect(response.body, false, null));
      }

      var npmModuleNames;
      try {
        // Pluck `key` from each result in the JSON response body
        npmModuleNames = _.map(rows, function (moduleMetadata){
          return moduleMetadata.key[1];
        });
      }
      catch(e) {return exits.error(err);}

      return exits.success(npmModuleNames);

    });

  },

};

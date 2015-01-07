module.exports = {
  friendlyName: 'List packages (detailed)',
  description: 'List all available metadata for packages on the public NPM registry that match the search query.',
  extendedDescription: '',
  inputs: {
    query: {
      example: 'sails',
      description: 'A string that will be used when querying npm.'
    }
  },
  defaultExit: 'success',
  exits: {
    error: {},
    success: {
      example: [
      '{...package.json data as a JSON string...}'
      ]
    }
  },
  fn: function (inputs, cb){

    var async = require('async');

    require('machine').build(require('./list-packages'))({
      query: inputs.query
    }).exec(function (err, npmPackageNames) {
      if (err) return cb(err);

      // Now expand each module with full results directly
      // from the npm registry.
      var npmModules = [];

      async.each(npmPackageNames, function (packageName, next) {
        require('machine').build(require('./get-package-json'))({
          packageName: packageName
        }).exec(function(err, packageJsonString) {
          if (err) return next(err);
          npmModules.push(packageJsonString);
          return next();
        });
      }, function (err) {
        if (err) return cb(err);
        return cb(null, npmModules);
      });
    });

  }

};

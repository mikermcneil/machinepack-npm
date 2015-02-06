module.exports = {
  friendlyName: 'List packages (detailed)',
  description: 'List matching packages and include metadata from their package.json files.',
  extendedDescription: 'Also includes the raw package.json string as `rawJson`, in case you need to parse additional non-standard metadata.',
  cacheable: true,
  inputs: {
    query: {
      example: 'sails',
      description: 'A string that will be used when querying npm.',
      extendedDescription: 'This string will be used to search within package keywords.',
      required: true
    }
  },
  defaultExit: 'success',
  exits: {
    error: {
      description: 'Unexpected error occurred'
    },
    success: {
      example: [ require('../schemas/package') ]
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
            // Attach raw json string
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

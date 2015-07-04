module.exports = {


  friendlyName: 'Unarrayify dependencies',


  description: 'Un-flatten the provided array back into a traditional NPM dependencies dictionary.',


  sync: true,


  cacheable: true,


  inputs: {

    dependencies: {
      description: 'A homogeneous array of dictionaries representing a set of dependencies.',
      example: [{
        name: 'lodash',
        semverRange: '^2.4.1'
      }],
      required: true
    }

  },


  exits: {

    success: {
      description: 'Returns a dependencies dictionary; i.e. from a package.json file',
      example: {}
    }

  },


  fn: function (inputs,exits) {

    var _ = require('lodash');

    // Un-flatten dependencies.
    var dependenciesDict = _.reduce(inputs.dependencies, function (memo, dependency){
      memo[dependency.name] = dependency.semverRange;
      return memo;
    }, {});

    return exits.success(dependenciesDict);

  }

};

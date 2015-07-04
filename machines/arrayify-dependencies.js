module.exports = {


  friendlyName: 'Arrayify dependencies',


  description: 'Flatten the provided depenencies dictionary into a homogeneous array of dictionaries.',


  sync: true,


  cacheable: true,


  inputs: {

    dependencies: {
      example: {},
      description: 'A dependencies dictionary; i.e. from a package.json file',
      required: true
    }

  },


  exits: {

    success: {
      example: [{
        name: 'lodash',
        semverRange: '^2.4.1'
      }]
    }

  },


  fn: function (inputs,exits) {

    var _ = require('lodash');

    // Flatten dependencies.
    var flattenedDeps = _.reduce(inputs.dependencies, function (memo, semverRange, name){
      memo.push({
        name: name,
        semverRange: semverRange
      });
      return memo;
    }, []);

    return exits.success(flattenedDeps);

  }

};

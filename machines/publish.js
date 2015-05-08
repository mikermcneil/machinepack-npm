module.exports = {


  friendlyName: 'Publish package',


  description: 'Publish a package to the public NPM registry.',


  inputs: {

    dir: {
      friendlyName: 'Directory',
      description: 'The path to the directory where the package is located on disk.',
      example: '/Users/mikermcneil/dogfood-promo-site',
      required: true
    },

    restrictAccess: {
      friendlyName: 'Restrict access?',
      description: 'Whether or not this package should be marked as private.',
      example: true,
      defaultsTo: false
    }

  },


  exits: {

    success: {
      description: 'Done.',
    },

  },


  fn: function (inputs,exits) {

    var Proc = require('machinepack-process');

    Proc.spawn({
      command: 'npm publish',
      dir: inputs.dir
    }).exec({
      error: function (err){
        return exits.error(err);
      },
      success: function (bufferedOutput){
        return exits.success();
      }
    });
  },



};

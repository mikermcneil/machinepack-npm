module.exports = {


  friendlyName: 'Unpublish package',


  description: 'Unpublish a package from the public NPM registry.',


  inputs: {

    'package': {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to unpublish.',
      example: 'cheerio',
      required: true
    },

    version: {
      friendlyName: 'Package version',
      description: 'The version to unpublish (if omitted, all versions will be unpublished)',
      example: '1.0.0'
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
      command: 'npm unpublish'
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

module.exports = {


  friendlyName: 'Open-source access',


  description: 'Open up public access to a package published on NPM.',


  inputs: {

    packageName: {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to open-source.',
      example: 'cheerio',
      required: true
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
      command: 'npm access public '+inputs.packageName
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

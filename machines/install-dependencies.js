module.exports = {


  friendlyName: 'Install NPM dependencies',


  description: 'Install NPM dependencies of local package at the specified path.',


  inputs: {

    dir: {
      friendlyName: 'Directory',
      description: 'The path to the directory where the package is located on disk.',
      example: '/Users/mikermcneil/dogfood-promo-site',
      extendedDescription: 'This is to the local package itself-- NOT its node_modules folder! Also note that, if specified as a relative path, this will be resolved relative to the current working directory.',
      required: true
    }

  },


  exits: {

    noSuchDir: {
      description: 'No directory exists at the provided path.'
    },

    notADir: {
      description: 'The provided path does not point to a directory (i.e. it might be a file or shortcut)'
    },

    invalidPackage: {
      description: 'The package does not contain a package.json file, or it cannot be parsed.'
    },

    success: {
      description: 'Done.'
    },

  },


  fn: function (inputs,exits) {

    var path = require('path');
    var Proc = require('machinepack-process');
    var Filesystem = require('machinepack-fs');

    // Ensure specified dir path is absolute by resolving it
    // relative to the current working directory.
    inputs.dir = path.resolve(inputs.dir);

    // Ensure this is a valid package.
    Filesystem.readJson({
      source: path.join(inputs.dir, 'package.json'),
      schema: {
        name: 'some-package',
        version: '2.0.0'
      }
    }, {
      error: exits.error,
      doesNotExist: function (){
        return exits.invalidPackage();
      },
      couldNotParse: function (){
        return exits.invalidPackage();
      },
      success: function (pkgData){

        // Run `npm install`
        Proc.spawn({
          command: 'npm install',
          dir: inputs.dir
        }).exec({
          error: function (err){
            try {
              // err.stack
              // err.killed
              // err.signal
              // err.code
              return exits.error(err);
            }
            catch (_e) {
              return exits.error(err||_e);
            }
          },
          notADir: exits.notADir,
          noSuchDir: exits.noSuchDir,
          success: function (bufferedOutput){
            return exits.success();
          }
        });
      }
    });

  }


};

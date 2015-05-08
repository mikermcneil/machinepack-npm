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

    alreadyExists: {
      description: 'Cannot overwrite- that package has already been published at the version in the package.json file.',
      extendedDescription: 'You should avoid publishing on top of existing versions of packages.  It can break developers\' production deployments.  However, if you made a terrible mistake and must do this, unpublish this version of your package and try running this machine again.  Note that you may need to wait 2-3 hours before the NPM registry will let you republish.'
    },

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
      description: 'Done.',
      example: {
        name: 'some-package',
        version: '2.0.0'
      }
    },

  },


  fn: function (inputs,exits) {

    var Path = require('path');
    var Proc = require('machinepack-process');
    var Filesystem = require('machinepack-fs');

    Filesystem.readJson({
      source: Path.resolve(inputs.dir, 'package.json'),
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
        Proc.spawn({
          command: 'npm publish',
          dir: inputs.dir
        }).exec({
          error: function (err){
            try {
              // err.stack
              // err.killed
              // err.signal
              // err.code
              if (err.message.match(/You cannot publish over the previously published version/i)){
                return exits.alreadyExists();
              }
              return exits.error(err);
            }
            catch (_e) {
              return exits.error(err);
            }
          },
          notADir: exits.notADir,
          noSuchDir: exits.noSuchDir,
          success: function (bufferedOutput){
            return exits.success(pkgData);
          }
        });
      }
    });

  },



};

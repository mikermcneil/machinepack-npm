module.exports = {
  friendlyName: 'Download package',
  description: 'Download the specified package from NPM as a tarball.',
  extendedDescription: '',
  cacheable: true,

  inputs: {

    name: {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to fetch',
      example: 'isarray',
      required: true,
    },

    version: {
      friendlyName: 'Package version',
      description: 'The version of the NPM package to fetch',
      example: '0.0.1',
      required: true,
    }
  },

  defaultExit: 'success',

  exits: {

    success: {
      description: 'Package successfully downloaded',
      extendedDescription: 'The untar\'ed files will be stored in the operating system\'s temporary directory under a folder given by the `name` and `version` inputs.  e.g. if `name` is "foobar" and `version` is "0.2.1", then the untar\'ed files might be in "/tmp/foobar-0.2.1/package/*".  This exit returns the absolute path to the folder of untar\'ed goodies.',
      example: '/var/folders/_s/347n05_x2rgb_0w6s6y0ytr00000gn/T/machinepack-phantomjscloud-0.1.2',
      variableName: 'pathToDownloadedPkg'

    },

    error: {
      description: 'Unexpected error occurred.',
      variableName: 'err'
    }
  },

  fn: function(inputs, exits) {

    /**
     * Dependencies
     */

    var request = require('request');
    var os = require('os');
    var path = require('path');
    var zlib = require('zlib');
    var tar = require('tar');

    // TODO: validate semver

    var fileName = inputs.name + '-' + inputs.version + '.tgz';
    var folderName = inputs.name + '-' + inputs.version;
    var uri = 'https://registry.npmjs.org/' + inputs.name + '/-/' + fileName;
    var tmp = path.resolve(os.tmpDir(), folderName);

    (function (cb){
      var gunner = zlib.createGunzip()
      .once('error', function (err){
        return cb(err||new Error('gzip extraction error'));
      });

      var extractor = tar.Extract({ path: tmp })
      .once('error', function (err){
        return cb(err||new Error('tar extraction error'));
      })
      .once('end', function() {
        return cb(null, tmp + '/package');
      });

      var httpClientRequest = request.get(uri);
      httpClientRequest.once('error', function (err){
        return cb(err||new Error('HTTP request stream error'));
      });
      httpClientRequest.pipe(gunner).pipe(extractor);
    })(function afterwards(err, resultPath){
      if (err) return exits.error(err);
      return exits.success(resultPath);
    });
  }

};

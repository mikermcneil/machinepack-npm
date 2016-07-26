module.exports = {


  friendlyName: 'Download package',


  description: 'Stream the tarball for the NPM package+version to disk, then extract it.',


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
    },

    registry: {
      friendlyName: 'Registry URL',
      description: 'The URL of the NPM registry to use (defaults to the public npm registry)',
      example: 'https://your-private-registry.npmjs.org',
      defaultsTo: 'https://registry.npmjs.org',
    }

  },


  exits: {

    success: {
      description: 'Package successfully downloaded.',
      extendedDescription: 'The untar\'ed files will be stored in the operating system\'s temporary directory under a folder given by the `name` and `version` inputs.  e.g. if `name` is "foobar" and `version` is "0.2.1", then the untar\'ed files might be in "/tmp/foobar-0.2.1/package/*".  This exit returns the absolute path to the folder of untar\'ed goodies.',
      outputFriendlyName: 'Path',
      outputDescription: 'The path to the downloaded NPM package on disk.',
      example: '/var/folders/_s/347n05_x2rgb_0w6s6y0ytr00000gn/T/machinepack-phantomjscloud-0.1.2',
    },

    untarFailed: {
      description: 'Could not extract (untar) the tarball downloaded from NPM.'
    },

    unzipFailed: {
      description: 'Could not unzip the `.tar.gz` file downloaded from NPM.'
    },

    downloadFailed: {
      description: 'Could not download the package from npm- perhaps the registry URL is incorrect?'
    },

    invalidSemVer: {
      description: 'Passed an invalid semantic version number. See https://docs.npmjs.com/misc/semver for details.'
    }
  },


  fn: function(inputs, exits) {
    var request = require('request');
    var os = require('os');
    var path = require('path');
    var zlib = require('zlib');
    var tar = require('tar');
    var Urls = require('machinepack-urls');
    var semver = require('semver');

    if (!semver.valid(inputs.version)) {
      return exits.invalidSemVer();
    }

    var remoteFilename = inputs.name + '-' + inputs.version + '.tgz';
    var folderName = inputs.name + '-' + inputs.version;
    var tmp = path.resolve(os.tmpDir(), folderName);


    // Build a sanitized version of the provided registry URL (i.e. with "http://")
    // (default to public NPM registry)
    var registryUrl = Urls.sanitize({
      url: inputs.registry || 'https://registry.npmjs.org',
    }).execSync();

    // Build the URL where the remote package tarball lives.
    var uri = Urls.buildUrlFromTemplate({
      urlTemplate: registryUrl+'/:name/-/:remoteFilename',
      data: {
        name: inputs.name,
        remoteFilename: remoteFilename
      },
    }).execSync();

    (function (done){
      var gunner = zlib.createGunzip()
      .once('error', function (err){
        return done(err||new Error('gzip extraction error'));
      });

      var extractor = tar.Extract({ path: tmp })
      .once('error', function (err){
        return done(err||new Error('tar extraction error'));
      })
      .once('end', function() {
        return done(null, tmp + '/package');
      });

      var httpClientRequest = request.get(uri);
      httpClientRequest.once('error', function (err){
        return done(err||new Error('HTTP request stream error'));
      });
      httpClientRequest.pipe(gunner).pipe(extractor);
    })(function afterwards(err, resultPath){
      if (err) { return exits.error(err); }
      return exits.success(resultPath);
    });
  }

};

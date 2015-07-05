module.exports = {


  friendlyName: 'Install package',


  description: 'Install a package from the NPM registry to the node_modules folder of a local project.',


  cacheable: true,


  inputs: {

    name: {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to install.',
      extendedDescription: 'Can also be a custom url to a package.',
      example: 'express',
      required: true,
    },

    version: {
      friendlyName: 'Version range',
      description: 'A version string (or semver range) of the NPM package to install.',
      example: '~1.0.0',
      defaultsTo: '*'
    },

    dir: {
      friendlyName: 'Directory',
      description: 'The local path where the package should be installed as a dependency.',
      extendedDescription: 'This is to the local package itself-- NOT its node_modules folder! Also note that, if specified as a relative path, this will be resolved relative to the current working directory.  If unspecified, the current working directory will be used.',
      example: '/Users/mikermcneil/dogfood-promo-site'
    },

    save: {
      friendlyName: 'Save dependency?',
      description: 'If set, the installed package will be saved to the package.json file as a dependency.',
      extendedDescription: 'This runs `npm install` with the --save flag enabled.',
      example: true,
      defaultsTo: false
    },

    saveDev: {
      friendlyName: 'Save dev dependency?',
      description: 'If set, the installed package will be saved to the package.json file as a development-only dependency.',
      extendedDescription: 'This runs `npm install` with the --save-dev flag enabled.',
      example: true,
      defaultsTo: false
    },

    prefix: {
      friendlyName: 'Prefix',
      description: 'An optional path prefix which affects the root path in which this NPM package gets installed.',
      extendedDescription: 'Note that the package will still be installed within node_modules of the destination directory. This just controls the `--prefix` command-line option passed to `npm install`.',
      example: './path-to-project'
    },

    loglevel: {
      friendlyName: 'Log level',
      description: 'If set, NPM will write logs to the console at the specified log level.',
      extendedDescription: 'This controls the --loglevel flag passed to `npm install`. Available options are "silent", "warn", "verbose" and "silly".',
      example: 'warn',
      defaultsTo: 'silent'
    }

  },


  exits: {

    success: {
      description: 'Package successfully installed.'
    },

    invalidSemVer: {
      description: 'Provided semver range is invalid. See https://docs.npmjs.com/misc/semver for more information.'
    }

  },

  fn: function(inputs, exits) {
    var path = require('path');
    var enpeem = require('enpeem');
    var semver = require('semver');

    // Resolve provided path to ensure it is absolute
    // (and default to cwd if it was left unspecified)
    inputs.dir = inputs.dir ? path.resolve(inputs.dir) : process.cwd();

    // Validate provided semver range.
    if (!semver.validRange(inputs.version)) {
      return exits.invalidSemVer();
    }

    // Install the npm package
    enpeem.install({
      dependencies: [
        inputs.name + '@' + inputs.version
      ],
      dir: inputs.dir,
      save: inputs.save,
      saveDev: inputs.saveDev,
      loglevel: inputs.loglevel,
      prefix: inputs.prefix,
      'cache-min': 999999999
    }, function (err) {
      if (err) { return exits.error(err); }
      return exits.success();
    });

  }

};

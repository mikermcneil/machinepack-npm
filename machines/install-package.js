module.exports = {
  friendlyName: 'Install package',
  description: 'Install a package from NPM package to your local project',
  extendedDescription: '',
  cacheable: true,

  inputs: {

    name: {
      friendlyName: 'Package name',
      description: 'The name of the NPM package to install. Can also be a custom url to a package.',
      example: 'express',
      required: true,
    },

    version: {
      friendlyName: 'Package version',
      description: 'The semantic version of the NPM package to install',
      example: '~1.0.0'
    },

    save: {
      friendlyName: '--save flag',
      description: 'Installs the npm package with the --save flag enabled',
      example: true
    },

    saveDev: {
      friendlyName: '--save-dev flag',
      description: 'Installs the npm package with the --save-dev flag enabled',
      example: true
    },

    prefix: {
      friendlyName: '--prefix flag',
      description: 'Changes the root path to where your npm package gets installed (it will still be installed within node_modules of that folder).',
      example: './path-to-project'
    },

    loglevel: {
      friendlyName: '--loglevel flag',
      description: 'Changes the loglevel of npm. silent, warn, verbose and silly are options.',
      example: 'warn'
    }
  },

  defaultExit: 'success',

  exits: {

    success: {
      description: 'Package successfully installed',
      extendedDescription: 'The package will be installed locally within',
      example: 'lodash',
      variableName: 'installedPackageName'
    },

    error: {
      description: 'Unexpected error occurred.',
      variableName: 'err'
    },

    invalidSemVer: {
      description: 'Passed an invalid semantic version number. See https://docs.npmjs.com/misc/semver for details.'
    }
  },

  fn: function(inputs, exits) {

    /**
     * Dependencies
     */

    var npm = require('enpeem');
    var semver = require('semver');


    var pkg = inputs.name;

    //check if version is passed
    if ('version' in inputs && inputs.version.length > 0) {
      //check if valid semantic version number or range
      if(semver.validRange(inputs.version)) {
        pkg += '@' + inputs.version
      } else {
        return exits.invalidSemVer();
      }
    }

    var npmSave = false;
    if ('save' in inputs && inputs.save) {
      npmSave = true;
    }

    var npmSaveDev = false;
    if ('saveDev' in inputs && inputs.saveDev) {
      npmSaveDev = true;
    }

    //console.log(process.cwd());

    //install the npm package
    npm.install({
      dependencies: [
        pkg
      ],
      save: npmSave,
      saveDev: npmSaveDev,
      loglevel: inputs.loglevel || 'silent',
      prefix: inputs.prefix || undefined,
      'cache-min': 999999999
    }, function (err) {
      if (err) { return exits.error(err); }
      return exits.success(pkg);
    });

  }

};

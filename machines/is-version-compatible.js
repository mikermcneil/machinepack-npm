module.exports = {


  friendlyName: 'Is version compatible?',


  description: 'Determine whether or not a particular NPM version string is compatible within a semver range.',


  cacheable: true,


  sync: true,


  inputs: {

    version: {
      description: 'NPM version to check.',
      example: '1.2.5',
      required: true
    },

    semverRange: {
      description: 'Semver range to check against for compatibility.',
      example: '^4.9.0',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Is version compatible?',
      outputDescription: 'Whether the version is compatible with ("satisfies") the specified semver range.',
      example: false
    }

  },


  fn: function(inputs, exits) {
    var semver = require('semver');

    var isCompatible = semver.satisfies(inputs.version, inputs.semverRange);

    // Note:
    // Just in case this is not strictly `true` or `false`, we might consider casting it
    // to a boolean here.  But since we know that machine/rttc take care of that for us,
    // we can skip this extra step.
    // isCompatible = !!isCompatible;

    return exits.success(isCompatible);
  }


};

module.exports = {


  friendlyName: 'Validate version',


  description: 'Validate (and potentially coerce) the specified string, verifying that it is compatible for use as an NPM version string.',


  cacheable: true,


  sync: true,


  inputs: {

    string: {
      description: 'The string to validate as a NPM-compatible/semver version string.',
      extendedDescription:
      'Keep in mind that this method expects a version string, **not a semver range**.  '+
      'So in other words, "1.0.0" is valid but "^1.0.0" is not.',
      example: '1.0.0',
      required: true
    },


    strict: {
      description: 'If set, instead of coercing, the validation will fail as "not strictly valid".',
      example: false,
      defaultsTo: false
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Version string',
      outputDescription: 'The validated version string (which might also have been coerced a bit).',
      example: '1.0.0'
    },

    isEmpty: {
      description: 'The specified string is empty (or at least it is after coercion).'
    },

    tooLong: {
      description: 'The specified string is too long (or at least it is after coercion).'
    },

    invalidSemanticVersion: {
      description: 'The specified string is not a valid semver (semantic version).',
    },

    notStrictlyValid: {
      description: 'The specified string is close, but not strictly valid (only relevant if `strict` is enabled).'
    }


  },


  fn: function(inputs, exits) {
    var _ = require('lodash');
    var semver = require('semver');

    // Coerce (/validate strict):
    //////////////////////////////////////////////////////////////////

    // TODO: coerce "almost" version strings, e.g. `1.0`


    // Validate:
    //////////////////////////////////////////////////////////////////

    // Not Blank
    //
    // i.e. empty string ('')
    if (inputs.string.length === 0) {
      return exits.isEmpty();
    }

    // 20 Characters Max
    if (inputs.string.length > 20) {
      return exits.tooLong();
    }

    // Semantic Version
    if (!semver.valid(inputs.string)) {
      return exits.invalidSemanticVersion();
    }

    // If we made it here, the provided string is valid and good to go!
    // (it also might have been coerced a bit)
    return exits.success(inputs.string);
  }


};

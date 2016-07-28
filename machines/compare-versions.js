module.exports = {


  friendlyName: 'Compare versions',


  description: 'Compare two NPM version strings and return either 1, 0, or -1.',


  extendedDescription:
  'This returns:\n'+
  ' • `1` if the version A is newer (greater)\n'+
  ' • `0` if both versions are the same\n'+
  ' • `-1` if the version A is older (less than)',


  cacheable: true,


  sync: true,


  inputs: {

    a: {
      friendlyName: 'Version A',
      example: '1.2.5',
      required: true
    },

    b: {
      friendlyName: 'Version B',
      example: '4.9.0',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Comparison',
      outputDescription: 'Either 1, 0, or -1; indicating which of the two versions is more recent (/greater), or if they\'re equivalent.',
      example: 1
    }

  },


  fn: function(inputs, exits) {
    var semver = require('semver');

    var comparison = semver.compare(inputs.a, inputs.b);

    return exits.success(comparison);
  }


};

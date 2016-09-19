module.exports = {


  friendlyName: 'Compare semver ranges',


  description: 'Compare two NPM semver ranges and return either 1, 0, or -1.',


  extendedDescription:
  'This returns:\n'+
  ' • `1` if the semver range A is compatible within semver range B\n'+
  ' • `0` if both semver ranges are the same\n'+
  ' • `-1` if the semver range A is outside of the bounds of semver range B',


  cacheable: true,


  sync: true,


  inputs: {

    a: {
      friendlyName: 'Semver range A',
      example: '~4.9.5',
      required: true
    },

    b: {
      friendlyName: 'Semver range B',
      example: '^4.9.0',
      required: true
    }

  },


  exits: {

    success: {
      outputFriendlyName: 'Comparison',
      outputDescription: 'Either 1, 0, or -1; indicating the first semver range\'s compatibility (inside, equivalent, or outside) vs. the second.',
      example: 1
    }

  },


  fn: function(inputs, exits) {
    var semver = require('semver');

    throw new Error('TODO: figure out how to implement this cleanly (it\'s not in the semver pkg)');
  }


};

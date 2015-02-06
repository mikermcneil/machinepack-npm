/**
 * Module depenencies
 */

var util = require('util');
var _ = require('lodash');
var async = require('async');
var Pack = require('./');



module.exports = function (beforeRunningAnyTests, eachTestSuite, done){

  // TODO: load opts and pass them to `beforeRunningAnyTests` fn
  var opts = {};

  beforeRunningAnyTests(opts, function readyToGo(err){
    if (err) return done(err);

    var machineIdentities;
    try {
      machineIdentities = require('./package.json').machinepack.machines;
    }
    catch (e) {
      return done(e);
    }

    async.map(machineIdentities, function (machineIdentity, next_machineSuite){

      eachTestSuite(machineIdentity, function (onTestFn, informSuiteFinished){

        // Load machine tests
        var testSuite = require('./tests/'+machineIdentity+'.json');

        // And run them
        require('./run-test-suite')(
          testSuite,
          function eachTestCase (testCase, runTest){
            onTestFn(testCase, runTest);
          },
          function afterwards (err, finalTestResults) {
            if (err) {
              console.error('Internal error while running tests:',err);
              return;
            }

            // Call informational callback, if provided
            if (_.isFunction(informSuiteFinished)) {
              informSuiteFinished();
            }

            next_machineSuite();
          }
        );

      });
    }, function (err, results) {
      if (err) {
        return done(err);
      }
      return done(null, results);
    });
  });
};

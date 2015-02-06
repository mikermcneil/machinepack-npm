/**
 * Module dependencies
 */

var _ = require('lodash');
var genericTestDriver = require('./run-all-tests');


//
// TODO: call mocha programatically instead of relying on omniscient `npm test` bash script in package.json
//

// Customize generic test driver for mocha
genericTestDriver(function beforeRunningAnyTests(opts, done){
  // e.g. set mocha.opts based on generic `opts` provided
  // TODO
  done();
}, function eachMachineSuite(machineIdentity, runTests){
  describe('`'+machineIdentity+'` machine', function (){
    runTests(function onTest(testCase, nextTestCase){
      var jsonInputVals;
      try {
        jsonInputVals = JSON.stringify(testCase.using);
      }
      catch (e) {
      }

      if (testCase.todo) {
        it('should exit with `'+testCase.outcome+'`'+(_.isUndefined(jsonInputVals)?'':' given input values: `'+jsonInputVals+'`') );
        return nextTestCase();
      }

      it('should exit with `'+testCase.outcome+'`'+ (_.isUndefined(jsonInputVals)?'':' given input values: `'+jsonInputVals+'`'), function (done){
        return nextTestCase(done);
      });
    });
  });
}, function afterRunningAllTests(err) {
  // Done.
});

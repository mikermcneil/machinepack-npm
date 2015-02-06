var runner = require('./run-tests');



var testSuite = require('./tests/list-packages.json');

describe('`list-packages` machine', function (){

  runner(
    testSuite,
    function eachTestCase (testCase, runTest){
      var jsonInputVals = JSON.stringify(testCase.using);
      it('should exit with `'+testCase.outcome+'` given input values: `'+jsonInputVals+'`', runTest);
    },
    function afterwards (err, finalTestResults) {
      if (err) {
        console.error('Internal error while running tests:',err);
        return;
      }
    }
  );

});

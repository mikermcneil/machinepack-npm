var runner = require('./run-tests');



var testSuite = require('./list-packages.json');

describe('`list-packages` machine', function (){
  runner(testSuite, function (testCase, runTest){
    it('should exit with `'+testCase.outcome+'`', runTest);
  }, function afterwards (err, finalTestResults) {
    if (err) {
      console.error('Internal error while running tests:',err);
      return;
    }
    // console.log('Done.');
  });
});

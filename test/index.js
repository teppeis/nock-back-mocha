'use strict';

const assert = require('assert');
const nockBackMocha = require('..')();

describe('nock-back-mocha', () => {
  it('dangles nockDone on the currentTest', () => {
    const mochaContext = {
      currentTest: {
        titlePath: () => ['foo', 'bar', 'baz1'],
      },
    };
    return nockBackMocha.beforeEach.call(mochaContext).then(() => {
      assert(
        typeof mochaContext.currentTest.nockDone === 'function',
        'nockDone must be set by beforeEach'
      );
    });
  });

  it('throws if file path is used more than once', () => {
    const mochaContext = {
      currentTest: {
        titlePath: () => ['foo', 'bar', 'baz2'],
      },
    };
    return nockBackMocha.beforeEach.call(mochaContext).then(() =>
      nockBackMocha.beforeEach.call(mochaContext).then(
        () => assert.fail('should be rejected'),
        err => {
          assert(err);
          assert(
            err.message ===
              'nock-back-mocha does not support multiple tests with the same name. foo/bar/baz2.json cannot be reused.'
          );
        }
      )
    );
  });
});

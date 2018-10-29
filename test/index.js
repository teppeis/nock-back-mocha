'use strict';

const assert = require('assert');
const path = require('path');
const nockBackMochaFactory = require('..');

describe('nock-back-mocha', () => {
  let nockBackMocha;
  let mochaContext;
  beforeEach(() => {
    nockBackMocha = nockBackMochaFactory();
    mochaContext = {
      currentTest: {
        titlePath: () => ['foo', 'bar', 'baz'],
      },
    };
  });

  it('factory(directory) specifies the fixtures directory from cwd', () => {
    const nockBackMocha = nockBackMochaFactory('abc');
    nockBackMocha.beforeEach.call(mochaContext).then(() => {
      const expectedFixture = path.join('abc', ...mochaContext.currentTest.titlePath());
      assert(nockBackMocha.fixtureFile === `${expectedFixture}.json`);
    });
  });

  it('beforeEach() injects some properties to the context', () =>
    nockBackMocha.beforeEach.call(mochaContext).then(() => {
      assert(typeof nockBackMocha.nockDone === 'function');
      assert(typeof nockBackMocha.assertScopesFinished === 'function');
      const expectedFixture = path.join(
        __dirname,
        '__nock_fixtures__',
        ...mochaContext.currentTest.titlePath()
      );
      assert(nockBackMocha.fixtureFile === `${expectedFixture}.json`);
    }));

  it('afterEach() resets injected properties', () =>
    nockBackMocha.beforeEach.call(mochaContext).then(() => {
      nockBackMocha.afterEach();
      assert(nockBackMocha.nockDone === null);
      assert(nockBackMocha.assertScopesFinished === null);
      assert(nockBackMocha.fixtureFile === null);
    }));

  it('throws if file path is used more than once', () =>
    nockBackMocha.beforeEach.call(mochaContext).then(() =>
      nockBackMocha.beforeEach.call(mochaContext).then(
        () => assert.fail('should be rejected'),
        err => {
          assert(err);
          assert(
            err.message ===
              'nock-back-mocha does not support multiple tests with the same name. foo/bar/baz.json cannot be reused.'
          );
        }
      )
    ));
});

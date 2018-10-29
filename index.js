'use strict';

const path = require('path');
const nock = require('nock');
const sanitize = require('sanitize-filename');

function defaultFixtures() {
  return path.join(path.dirname(module.parent.filename), '__nock_fixtures__');
}

module.exports = function nockBackMocha(fixtures = defaultFixtures()) {
  const filenames = new Set();
  let previousFixtures;
  const nockBackContext = {
    fixtureFile: null,
    assertScopesFinished: null,
    nockDone: null,
    beforeEach() {
      previousFixtures = nock.back.fixtures;
      const filename = `${path.join(...this.currentTest.titlePath().map(sanitize))}.json`;
      // make sure we're not reusing the nock file
      if (filenames.has(filename)) {
        return Promise.reject(
          new Error(
            `nock-back-mocha does not support multiple tests with the same name. ${filename} cannot be reused.`
          )
        );
      }
      filenames.add(filename);
      nock.back.fixtures = fixtures;
      nockBackContext.fixtureFile = path.join(fixtures, filename);

      return nock.back(filename).then(({nockDone, context}) => {
        nockBackContext.assertScopesFinished = context.assertScopesFinished.bind(context);
        nockBackContext.nockDone = () => {
          nockDone();
        };
      });
    },
    afterEach() {
      nock.back.fixtures = previousFixtures;
      nockBackContext.fixtureFile = null;
      nockBackContext.assertScopesFinished = null;
      if (nockBackContext.nockDone) {
        nockBackContext.nockDone();
      }
      nockBackContext.nockDone = null;
    },
  };
  return nockBackContext;
};

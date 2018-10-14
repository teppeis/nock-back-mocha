'use strict';

const path = require('path');
const nock = require('nock');
const sanitize = require('sanitize-filename');

function defaultFixtures() {
  return path.join(path.dirname(module.parent.filename), '__nock_fixtures__');
}

module.exports = (fixtures = defaultFixtures()) => {
  const filenames = new Set();
  return {
    beforeEach() {
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
      nock.back.fixtureFile = path.join(fixtures, filename);

      const previousFixtures = nock.back.fixtures;
      nock.back.fixtures = fixtures;

      return nock.back(filename).then(({nockDone, context}) => {
        this.currentTest.nockDone = () => {
          nockDone();
          context.assertScopesFinished();
          nock.back.fixtures = previousFixtures;
          delete nock.back.fixtureFile;
        };
      });
    },
    afterEach() {
      this.currentTest.nockDone();
      delete this.currentTest.nockDone;
    },
  };
};

'use strict';

const assert = require('assert');
const nockBackMocha = require('../')();
const request = require('request-promise-native');
const back = require('nock').back;

const r = request.defaults({
  json: true,
  headers: {
    'User-Agent': '@teppeis/nock-back-mocha',
  },
});

describe('GitHub', () => {
  beforeEach(nockBackMocha.beforeEach);
  afterEach(nockBackMocha.afterEach);

  it('get user', async () => {
    const user = await r('https://api.github.com/users/teppeis');
    console.log(back.fixtureFile);
    assert.equal(user.login, 'teppeis');
  });

  it('get org', async () => {
    const org = await r('https://api.github.com/orgs/github');
    console.log(back.fixtureFile);
    assert.equal(org.login, 'github');
  });
});

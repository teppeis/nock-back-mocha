# @teppeis/nock-back-mocha

Thin wrapper around [nock.back](https://github.com/nock/nock#nock-back) that uses different nock files for each test, and cleans up when the mocha test is done.

[![npm version][npm-image]][npm-url]
![Node.js Version Support][node-version]
[![build status][circleci-image]][circleci-url]
[![dependency status][deps-image]][deps-url]
![License][license]

## Install

```console
$ npm i -D @teppeis/nock-back-mocha
```

## Usage

```js
const nockBackMocha = require('nock-back-mocha')();

describe('Tests!', () => {
  beforeEach(nockBackMocha.beforeEach);
  afterEach(nockBackMocha.afterEach);

  it('makes an http request', () =>
    fetch('http://example.com').then(() => {
      // "/path/to/__nock_fixtures__/Tests!/makes\ an\ http\ request.json"
      console.log(nockBackMocha.fixtureFile);
      nockBackMocha.assertScopesFinished();
    }));
});
```

### API: `factory(directory: string?): Context`

- `directory: string?`: Where do you want the nock files stored? The default is `__nock_fixtures__` in the same directory.
- `Context.beforeEach: (this: MochaContext) => Promise<undefined>`: Setup nock.back. Call in mocha's `beforeEach`.
- `Context.afterEach: () => void`: Tear down nock.back. Call in mocha's `afterEach`.
- `Context.fixtureFile: string`: Path to the fixture file for the current test.
- `Context.assertScopesFinished: () => void`: Assert all nocks in fixture were satisfied. See [nock document](https://github.com/nock/nock).

### Pro Tip

Use in combination with env [NOCK_BACK_MODE](https://github.com/nock/nock#modes) to generate http fixtures for your tests

## License

MIT License: Teppei Sato &lt;teppeis@gmail.com&gt;

Derived from [porchdotcom/nock-back-mocha](https://github.com/porchdotcom/nock-back-mocha) under ICS license

[npm-image]: https://img.shields.io/npm/v/@teppeis/nock-back-mocha.svg
[npm-url]: https://npmjs.org/package/@teppeis/nock-back-mocha
[npm-downloads-image]: https://img.shields.io/npm/dm/@teppeis/nock-back-mocha.svg
[deps-image]: https://img.shields.io/david/teppeis/nock-back-mocha.svg
[deps-url]: https://david-dm.org/teppeis/nock-back-mocha
[node-version]: https://img.shields.io/badge/Node.js%20support-v6,v8,v10-brightgreen.svg
[license]: https://img.shields.io/npm/l/@teppeis/nock-back-mocha.svg
[circleci-image]: https://circleci.com/gh/teppeis/nock-back-mocha.svg?style=shield
[circleci-url]: https://circleci.com/gh/teppeis/nock-back-mocha

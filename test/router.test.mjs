import { Window } from 'happy-dom';
import { describe, it, beforeEach, assert } from 'poku';

const window = new Window({ url: 'http://localhost:9090/' });
globalThis.window = window;

const { router } = await import('../src/router.mjs');
const reset = () => {
  router.routes.clear();
  router.currentRoute = null;
  router.debug = false;
  window.history.replaceState(null, '', '/');
};

beforeEach(reset);

const go = (path, query) => {
  router.navigate(path, query);
  router.handle();
};

describe('router.route() + navigate() + getRoute()', () => {
  it('binds a named param and exposes it through getRoute()', () => {
    let handlerArgs = null;
    router.route('lib/:n/src', (parsed) => {
      handlerArgs = parsed;
    });
    go('lib/test/src', { path: '/root/file.css' });
    assert.deepEqual(handlerArgs, {
      path: 'lib/test/src',
      params: { n: 'test' },
      query: { path: '/root/file.css' },
    });
    assert.deepEqual(router.getRoute(), {
      pattern: 'lib/:n/src',
      path: 'lib/test/src',
      params: { n: 'test' },
      query: { path: '/root/file.css' },
    });
  });
  it('percent-encodes query values on navigate and decodes them when matching', () => {
    let seen = null;
    router.route('user/:id', (parsed) => {
      seen = parsed;
    });
    go('user/123', { tab: 'posts', q: 'a b' });
    assert.equal(window.location.hash, '#user/123?tab=posts&q=a%20b');
    assert.deepEqual(seen.params, { id: '123' });
    assert.deepEqual(seen.query, { tab: 'posts', q: 'a b' });
  });
  it('omits the query string when query is empty', () => {
    router.route('about', () => {});
    go('about');
    assert.equal(window.location.hash, '#about');
    assert.deepEqual(router.getRoute().query, {});
  });
  it('matches the first registered pattern only, in insertion order', () => {
    const called = [];
    router.route('a/:any', () => called.push('first'));
    router.route('a/:x', () => called.push('second'));
    go('a/1');
    assert.deepEqual(called, ['first']);
    assert.equal(router.getRoute().pattern, 'a/:any');
  });
  it('assigns :any positionally', () => {
    let params = null;
    router.route('docs/:any/:any', (parsed) => {
      params = parsed.params;
    });
    go('docs/api/guides');
    assert.deepEqual(params, { $0: 'api', $1: 'guides' });
  });
  it('reports a route change even when the hash is unchanged', () => {
    let calls = 0;
    router.route('ping', () => calls++);
    go('ping');
    router.handle();
    assert.equal(calls, 2);
  });
});

describe('router.handle()', () => {
  it('routes the "/" root pattern for both "#/" and an empty hash', () => {
    let seen = null;
    router.route('/', (parsed) => {
      seen = parsed;
    });
    router.route(':page', () => assert.fail('wildcard should not match the root'));
    window.location.hash = '#/';
    router.handle();
    assert.deepEqual(seen, { path: '/', params: {}, query: {} });
    window.history.replaceState(null, '', '/');
    router.handle();
    assert.deepEqual(seen, { path: '/', params: {}, query: {} });
  });
  it('still leaves currentRoute null when the root is not registered', () => {
    window.location.hash = '#/';
    router.handle();
    assert.equal(router.getRoute(), null);
  });
  it('leaves currentRoute untouched on a miss', () => {
    window.location.hash = '#nope/deep';
    router.handle();
    assert.equal(router.getRoute(), null);
  });
  it('warns on an unmatched hash only while debug is set', () => {
    router.route('other/:id', () => assert.fail('should not match'));
    window.location.hash = '#nope/deep';
    const warnings = [];
    const original = console.warn;
    console.warn = (msg) => warnings.push(msg);
    try {
      router.handle();
      assert.deepEqual(warnings, [], 'silent by default');
      router.debug = true;
      router.handle();
    } finally {
      console.warn = original;
    }
    assert.deepEqual(warnings, ['No route matched for hash: #nope/deep']);
  });
});

describe('hashchange wiring', () => {
  it('routes a real hashchange event, asynchronously', async () => {
    const settled = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('no hashchange within 1000ms')), 1000);
      window.addEventListener(
        'hashchange',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
    });
    let seen = null;
    router.route('live/:id', (parsed) => {
      seen = parsed;
    });
    window.location.hash = '#live/7';
    await settled;
    assert.deepEqual(seen, { path: 'live/7', params: { id: '7' }, query: {} });
  });
});

import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { Window } from 'happy-dom';

const window = new Window({ url: 'http://localhost:9090/' });
globalThis.window = window;

const { default: router } = await import('../src/router.mjs');

const reset = () => {
  router.routes.clear();
  router.currentRoute = null;
  router.debug = false;
  window.history.replaceState(null, '', '/');
};

const go = (path, query) => {
  router.navigate(path, query);
  router.handle();
};

const routes = suite('router.route() + navigate() + getRoute()');

routes.before.each(reset);

routes('binds a named param and exposes it through getRoute()', () => {
  let handlerArgs = null;
  router.route('lib/:n/src', (parsed) => {
    handlerArgs = parsed;
  });
  go('lib/test/src', { path: '/root/file.css' });
  assert.equal(handlerArgs, {
    path: 'lib/test/src',
    params: { n: 'test' },
    query: { path: '/root/file.css' },
  });
  assert.equal(router.getRoute(), {
    pattern: 'lib/:n/src',
    path: 'lib/test/src',
    params: { n: 'test' },
    query: { path: '/root/file.css' },
  });
});

routes('percent-encodes query values on navigate and decodes them when matching', () => {
  let seen = null;
  router.route('user/:id', (parsed) => {
    seen = parsed;
  });
  go('user/123', { tab: 'posts', q: 'a b' });
  assert.is(window.location.hash, '#user/123?tab=posts&q=a%20b');
  assert.equal(seen.params, { id: '123' });
  assert.equal(seen.query, { tab: 'posts', q: 'a b' });
});

routes('omits the query string when query is empty', () => {
  router.route('about', () => {});
  go('about');
  assert.is(window.location.hash, '#about');
  assert.equal(router.getRoute().query, {});
});

routes('matches the first registered pattern only, in insertion order', () => {
  const called = [];
  router.route('a/:any', () => called.push('first'));
  router.route('a/:x', () => called.push('second'));
  go('a/1');
  assert.equal(called, ['first']);
  assert.is(router.getRoute().pattern, 'a/:any');
});

routes('assigns :any positionally', () => {
  let params = null;
  router.route('docs/:any/:any', (parsed) => {
    params = parsed.params;
  });
  go('docs/api/guides');
  assert.equal(params, { $0: 'api', $1: 'guides' });
});

routes('reports a route change even when the hash is unchanged', () => {
  let calls = 0;
  router.route('ping', () => calls++);
  go('ping');
  router.handle();
  assert.is(calls, 2);
});

routes.run();

const handle = suite('router.handle()');

handle.before.each(reset);

handle('routes the "/" root pattern for both "#/" and an empty hash', () => {
  let seen = null;
  router.route('/', (parsed) => {
    seen = parsed;
  });
  router.route(':page', () => assert.unreachable('wildcard should not match the root'));
  window.location.hash = '#/';
  router.handle();
  assert.equal(seen, { path: '/', params: {}, query: {} });
  window.history.replaceState(null, '', '/');
  router.handle();
  assert.equal(seen, { path: '/', params: {}, query: {} });
});

handle('still leaves currentRoute null when the root is not registered', () => {
  window.location.hash = '#/';
  router.handle();
  assert.is(router.getRoute(), null);
});

handle('leaves currentRoute untouched on a miss', () => {
  window.location.hash = '#nope/deep';
  router.handle();
  assert.is(router.getRoute(), null);
});

handle('warns on an unmatched hash only while debug is set', () => {
  router.route('other/:id', () => assert.unreachable('should not match'));
  window.location.hash = '#nope/deep';
  const warnings = [];
  const original = console.warn;
  console.warn = (msg) => warnings.push(msg);
  try {
    router.handle();
    assert.equal(warnings, [], 'silent by default');
    router.debug = true;
    router.handle();
  } finally {
    console.warn = original;
  }
  assert.equal(warnings, ['No route matched for hash: #nope/deep']);
});

handle.run();

const wiring = suite('hashchange wiring');

wiring.before.each(reset);

wiring('routes a real hashchange event, asynchronously', async () => {
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
  assert.equal(seen, { path: 'live/7', params: { id: '7' }, query: {} });
});

wiring.run();

const api = suite('default export + router.match()');

api.before.each(reset);

api('exposes the router as the only export', async () => {
  const mod = await import('../src/router.mjs');
  assert.equal(Object.keys(mod), ['default']);
  assert.is(mod.default, router);
});

api('match() parses without touching the route table', () => {
  assert.equal(router.match('#/home/', '/home'), { path: '/home', params: {}, query: {} });
  assert.is(router.getRoute(), null);
});

api.run();

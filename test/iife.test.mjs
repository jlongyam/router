import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const file = new URL('../dist/router.js', import.meta.url);

const iife = suite('dist IIFE build');

iife('is produced by pnpm build', () => {
  assert.ok(existsSync(file));
});

iife('auto-registers only the ready-made router on the global object', () => {
  const events = [];
  const sandbox = {
    console,
    window: {
      addEventListener: (type) => events.push(type),
      location: { hash: '' },
    },
  };
  vm.createContext(sandbox);
  vm.runInContext(readFileSync(file, 'utf8'), sandbox);

  assert.equal(typeof sandbox.router, 'object');
  assert.is(sandbox.Router, undefined);
  assert.equal(events.sort(), ['hashchange', 'load']);
  assert.is(sandbox.router.getRoute(), null);

  // Round-trip through JSON: values created inside the vm realm have a
  // different Object constructor, which deep-equal (dequal) would reject.
  assert.equal(JSON.parse(JSON.stringify(sandbox.router.match('#/', '/'))), {
    path: '/',
    params: {},
    query: {},
  });
});

iife.run();

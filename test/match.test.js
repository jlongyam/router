import { test, assert } from './core.mjs';
import { match } from '../src/RouterHash.js';

let a = ['lib/:n/src', '#lib/test/src?path=/root/file.css'];
test.it(a.join(' > '), ()=> {
  let a1 = {
    path: 'lib/test/src',
    params: { n: 'test' },
    query: { path: '/root/file.css' }
  }
  assert.deepEqual(match(a[0], a[1]), a1);
});

let b = ['docs/:any/:any', '#docs/api/guides?format=json']
test.it(b.join(' > '), ()=> {
  let b1 = {
    path: "docs/api/guides",
    params: { $0: "api", $1: "guides" },
    query: { format: "json" }
  }
  assert.deepEqual(match(b[0], b[1]), b1);
});

let c = ['user/:id', '#user/123/extra']
test.it(c.join(' > '), ()=> {
  assert.deepEqual(match('user/:id', '#user/123/extra'), null, 'null');
});

let d = ['user/:id', '#user/123?name=john']
test.it(d.join(' > '), ()=> {
  let d1 = {
    path: "user/123",
    params: { id: "123" },
    query: { name: "john" }
  }
  assert.deepEqual(match('user/:id', '#user/123?name=john'), d1, JSON.stringify(d1));
});

test.run();

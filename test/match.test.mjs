import { suite } from 'uvu';
import * as assert from 'uvu/assert';
import { match } from '../src/match.mjs';

const cases = suite('match( hash, route ) -> { path, params, query }');

cases('#lib/test/src?path=/root/file.css > lib/:n/src', () => {
  assert.equal(match('#lib/test/src?path=/root/file.css', 'lib/:n/src'), {
    path: 'lib/test/src',
    params: { n: 'test' },
    query: { path: '/root/file.css' },
  });
});

cases('#docs/api/guides?format=json > docs/:any/:any', () => {
  assert.equal(match('#docs/api/guides?format=json', 'docs/:any/:any'), {
    path: 'docs/api/guides',
    params: { $0: 'api', $1: 'guides' },
    query: { format: 'json' },
  });
});

cases('#/ > / (root)', () => {
  assert.equal(match('#/', '/'), { path: '/', params: {}, query: {} });
});

cases('"" > / (empty hash)', () => {
  assert.equal(match('', '/'), { path: '/', params: {}, query: {} });
});

cases('#/ > :page (wildcard no longer swallows root)', () => {
  assert.equal(match('#/', ':page'), null);
});

cases('#/home/ > /home (trailing slash still trimmed)', () => {
  assert.equal(match('#/home/', '/home'), { path: '/home', params: {}, query: {} });
});

cases.run();

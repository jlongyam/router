import { existsSync, readFileSync } from 'node:fs';
import vm from 'node:vm';
import { parseSync } from '@babel/core';
import { suite } from 'uvu';
import * as assert from 'uvu/assert';

const file = new URL('../dist/router.legacy.js', import.meta.url);
const demo = new URL('../usage/legacy/route.js', import.meta.url);

// Anything that a pre-ES2015 engine cannot parse.
const ES2015_NODES = new Set([
  'ArrowFunctionExpression',
  'ClassBody',
  'ClassDeclaration',
  'ClassExpression',
  'ClassMethod',
  'ClassPrivateMethod',
  'ClassPrivateProperty',
  'ClassProperty',
  'StaticBlock',
  'PrivateName',
  'TemplateLiteral',
  'TaggedTemplateExpression',
  'ForOfStatement',
  'ImportDeclaration',
  'ExportNamedDeclaration',
  'ExportDefaultDeclaration',
  'ExportAllDeclaration',
  'ImportExpression',
  'AwaitExpression',
  'YieldExpression',
  'MetaProperty',
  'Super',
  'ObjectMethod',
  'SpreadElement',
  'RestElement',
  'ObjectPattern',
  'ArrayPattern',
  'AssignmentPattern',
  'OptionalMemberExpression',
  'OptionalCallExpression',
  'ChainExpression',
  'BigIntLiteral',
]);

function walk(node, visit) {
  if (!node || typeof node !== 'object') return;
  if (Array.isArray(node)) {
    for (const child of node) walk(child, visit);
    return;
  }
  if (typeof node.type === 'string') visit(node);
  for (const key of Object.keys(node)) {
    if (key === 'loc' || key === 'start' || key === 'end' || key === 'extra') continue;
    if (key.endsWith('Comments')) continue;
    walk(node[key], visit);
  }
}

/** Returns every ES2015+ construct found in `code`, sorted for stable output. */
function es5Violations(code, filename) {
  const ast = parseSync(code, {
    filename,
    sourceType: 'script',
    configFile: false,
    babelrc: false,
  });

  const violations = new Set();
  walk(ast.program, (node) => {
    if (ES2015_NODES.has(node.type)) violations.add(node.type);
    if (node.type === 'VariableDeclaration' && node.kind !== 'var') {
      violations.add(`VariableDeclaration (${node.kind})`);
    }
    if (node.type === 'Property' && node.shorthand) violations.add('shorthand property');
  });

  return [...violations].sort();
}

const legacy = suite('dist legacy build');

legacy('is produced by pnpm build', () => {
  assert.ok(existsSync(file));
});

legacy('contains no syntax newer than ES5', () => {
  assert.equal(es5Violations(readFileSync(file, 'utf8'), 'router.legacy.js'), []);
});

legacy('still exposes window.router when the polyfills are present', () => {
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
  assert.equal(JSON.parse(JSON.stringify(sandbox.router.match('#/', '/'))), {
    path: '/',
    params: {},
    query: {},
  });
});

legacy.run();

const demoSuite = suite('legacy demo page');

demoSuite('usage/legacy/route.js is ES5 too', () => {
  if (!existsSync(demo)) return;
  assert.equal(es5Violations(readFileSync(demo, 'utf8'), 'usage/legacy/route.js'), []);
});

demoSuite.run();

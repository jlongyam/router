// Headless WebKit smoke test: the engine behind Safari and iOS WKWebView.
//
//   pnpm test:webkit
//
// Serves the repository over HTTP (module scripts are blocked on file://),
// loads test/fixtures/webkit.html and checks matching, :name params, hashchange
// wiring and router.navigate().
import assert from 'node:assert/strict';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve, sep } from 'node:path';
import { webkit } from 'playwright';

const root = resolve(import.meta.dirname, '..');

const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
};

const server = createServer(async (request, response) => {
  const { pathname } = new URL(request.url, 'http://127.0.0.1');

  if (pathname === '/favicon.ico') {
    response.writeHead(204).end();
    return;
  }

  const file = resolve(root, '.' + pathname);
  if (file !== root && !file.startsWith(root + sep)) {
    response.writeHead(403).end();
    return;
  }

  try {
    const stats = await stat(file);
    if (!stats.isFile()) throw new Error('not a file');
  } catch {
    response.writeHead(404).end();
    return;
  }

  response.writeHead(200, { 'content-type': contentTypes[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(response);
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));

const browser = await webkit.launch();
const page = await browser.newPage();
const pageErrors = [];
page.on('pageerror', (error) => pageErrors.push(error.message));

try {
  await page.goto(`http://127.0.0.1:${server.address().port}/test/fixtures/webkit.html`);
  await page.waitForFunction(() => window.__ready === true);

  assert.deepEqual(await page.evaluate(() => window.__match), {
    path: 'page/test',
    params: { $0: 'test' },
    query: { asset: 'a.js' },
  });

  // hashchange wiring: a plain hash assignment should route.
  await page.evaluate(() => {
    window.location.hash = '#home';
  });
  await page.waitForFunction(() => document.body.dataset.page === 'home');

  // named params through router.navigate().
  await page.evaluate(() => window.__router.navigate('admin'));
  await page.waitForFunction(() => document.body.dataset.page === 'admin');

  await page.evaluate(() => window.__router.navigate('lib/x/src'));
  await page.waitForFunction(() => document.body.dataset.lib === 'x');

  assert.deepEqual(pageErrors, []);
  console.log('webkit: match, hashchange and navigate ok');
} finally {
  await browser.close();
  await new Promise((done) => server.close(done));
}

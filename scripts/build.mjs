// Builds the generated artefacts this package ships:
//
//   dist/router.js         -> modern IIFE, <script src="...">  =>  window.router
//   dist/router.legacy.js  -> same code transpiled to ES5 for old engines
//
// Both files keep a single global (`router`) and never expose the Router class.
// The ESM source in src/ is shipped as-is; dist/ is git-ignored and produced on
// demand (test, publish).
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { babel } from '@rollup/plugin-babel';
import { rollup } from 'rollup';

async function bundle({ outFile, legacy = false }) {
  const plugins = legacy
    ? [
        babel({
          babelHelpers: 'bundled',
          // Syntax only: runtime APIs (Map, Symbol.iterator, Object.entries,
          // String.prototype.startsWith) are the consumer's polyfill job.
          presets: [
            [
              '@babel/preset-env',
              {
                targets: { ie: '11' },
                modules: false,
              },
            ],
          ],
        }),
      ]
    : [];

  const build = await rollup({ input: 'src/router.mjs', plugins });
  const { output } = await build.generate({
    format: 'iife',
    name: 'router',
    exports: 'default',
  });
  await build.close();

  await writeFile(outFile, output[0].code);
  return output[0].code.length;
}

// Start clean so a stale artefact can never end up in the published tarball.
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });

const modern = await bundle({ outFile: 'dist/router.js' });
const legacy = await bundle({ outFile: 'dist/router.legacy.js', legacy: true });

console.log(`built dist/router.js (${modern} B) and dist/router.legacy.js (${legacy} B)`);

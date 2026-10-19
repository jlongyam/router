// Type-level check for src/router.d.mts. Compiled only, never executed:
// `pnpm typecheck` runs it through tsc --noEmit.
import router from '../src/router.mjs';
import type { MatchResult, RouteHandler, RouteMatch, Router } from '../src/router.mjs';
// Resolves through package.json "exports" -> "types" (self reference).
import published from '@jlbyte/router';

const instance: Router = router;
const fromPackage: Router = published;
void instance;
void fromPackage;

const parsed: MatchResult | null = router.match('#page/test?asset=/path/to/file.js', 'page/:any');

if (parsed) {
  const path: string = parsed.path;
  const asset: string = parsed.query.asset;
  const firstAny: string = parsed.params.$0;
  void path;
  void asset;
  void firstAny;
}

router.route('style/:action', ({ params, query }: MatchResult) => {
  void params.action;
  void query.file;
});

const handler: RouteHandler = (result) => void result.path;
router.route('docs/:any/:any', handler);

router.navigate('#style/load?file=style.css');
router.navigate('user/1', { tab: 'posts' });

const current: RouteMatch | null = router.getRoute();
void current?.pattern;

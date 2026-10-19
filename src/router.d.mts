/**
 * A hash based router.
 *
 * @see https://github.com/jlongyam/router
 */

/** Parsed value of a hash matched against a route pattern. */
export interface MatchResult {
  /** Hash path, without the leading `#`, the query string and any trailing slash. */
  path: string
  /**
   * Route parameters. A `:name` segment is stored under `name`; a `:any`
   * segment is positional and stored as `$0`, `$1`, ... in order.
   */
  params: Record<string, string>
  /** Decoded query string parameters. */
  query: Record<string, string>
}

/** A match plus the pattern that produced it. */
export interface RouteMatch extends MatchResult {
  /** The route pattern this match came from, e.g. `lib/:n/src`. */
  pattern: string
}

export type RouteHandler = (match: MatchResult) => void

/**
 * The router instance shape. There is no runtime `Router` export: the package
 * default-exports a ready-made router, so `new Router()` is never needed.
 */
export interface Router {
  /** Registered patterns, in insertion order. */
  routes: Map<string, RouteHandler>

  /** Last matched route, or `null` when nothing has matched yet. */
  currentRoute: RouteMatch | null

  /** Log a warning on unmatched hashes when `true`. */
  debug?: boolean

  /**
   * Match a hash against a route pattern, without touching the route table.
   *
   * @returns the parsed match, or `null` when the pattern does not match.
   */
  match(hash: string, routePattern: string): MatchResult | null

  /** Register a handler for a pattern and return the router for chaining. */
  route(pattern: string, handler: RouteHandler): this

  /** Match the current hash and call the first matching handler. */
  handle(): void

  /**
   * Set `window.location.hash`, appending a query string when `query` is
   * not empty.
   */
  navigate(path: string, query?: Record<string, string>): void

  /** The current route, or `null` when nothing has matched yet. */
  getRoute(): RouteMatch | null
}

/** Ready-made router bound to `window`'s `hashchange` and `load` events. */
declare const router: Router

export default router

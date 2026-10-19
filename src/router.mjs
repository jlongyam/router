import { match as matchHash } from './match.mjs';

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handle());
      window.addEventListener('load', () => this.handle());
    }
  }
  /** Parse `hash` against `pattern` without touching the route table. */
  match(hash, pattern) {
    return matchHash(hash, pattern);
  }
  route(pattern, handler) {
    this.routes.set(pattern, handler);
    return this;
  }
  handle() {
    const hash = window.location.hash || '#/';
    let matched = false;
    for (const [pattern, handler] of this.routes) {
      const parsed = this.match(hash, pattern);
      if (parsed !== null) {
        matched = true;
        this.currentRoute = { pattern, ...parsed };
        handler(parsed);
        break;
      }
    }
    if (!matched && this.debug) {
      console.warn(`No route matched for hash: ${hash}`);
    }
  }
  navigate(path, query = {}) {
    let hash = path;
    if (Object.keys(query).length > 0) {
      const queryString = Object.entries(query)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&');
      hash += `?${queryString}`;
    }
    window.location.hash = hash;
  }
  getRoute() {
    return this.currentRoute;
  }
}

const router = new Router();

// The package intentionally has a single default export: it is what lets the
// IIFE build expose `window.router` directly (rollup `output.exports: 'default'`).
export default router;

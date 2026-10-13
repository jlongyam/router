import { match } from "./match.mjs";

class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    window.addEventListener('hashchange', () => this.handle());
    window.addEventListener('load', () => this.handle());
  }
  route(pattern, handler) {
    this.routes.set(pattern, handler);
    return this;
  }
  handle() {
    const hash = window.location.hash || '#/';
    let matched = false;
    for (const [pattern, handler] of this.routes) {
      const parsed = match(hash, pattern);
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

export { match, router }

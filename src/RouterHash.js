function match(routePattern, hash) {
  // Remove '#'
  let hashStr = hash.replace(/^#/, '');

  // Split at '?' - path is before '?'
  const queryIndex = hashStr.indexOf('?');
  let path = queryIndex !== -1 ? hashStr.substring(0, queryIndex) : hashStr;
  const queryString = queryIndex !== -1 ? hashStr.substring(queryIndex + 1) : '';

  // Remove trailing slash
  path = path.replace(/\/$/, '');

  // Parse query
  const query = {};
  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }

  // Match pattern
  const patternParts = routePattern.split('/');
  const pathParts = path.split('/');

  if (patternParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < patternParts.length; i++) {
    const pattern = patternParts[i];
    const value = pathParts[i];

    if (pattern === ':any') {
      params[`$${Object.keys(params).length}`] = value;
    } else if (pattern.startsWith(':')) {
      params[pattern.slice(1)] = value;
    } else if (pattern !== value) {
      return null;
    }
  }

  return { path, params, query };
}
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
      const parsed = match(pattern, hash);
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

export { match, Router }
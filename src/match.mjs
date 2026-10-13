function match(hash, routePattern) {
  const hashStr = hash.replace(/^#/, '');
  const queryIndex = hashStr.indexOf('?');
  const queryString = queryIndex !== -1 ? hashStr.substring(queryIndex + 1) : '';
  let path = queryIndex !== -1 ? hashStr.substring(0, queryIndex) : hashStr;

  path = path.replace(/\/$/, '');
  const query = {};

  if (queryString) {
    queryString.split('&').forEach(param => {
      const [key, value] = param.split('=');
      if (key) query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    });
  }

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

export { match }
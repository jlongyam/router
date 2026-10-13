import { describe, it, assert } from "poku";
import { match } from "../src/match.mjs";

let args = {};
let returns = {
  path: '',
  params: {},
  query: {}
};

describe('match( hash, route ) -> { path, params, query }', async ()=> {  
  args = {
    hash: '#lib/test/src?path=/root/file.css',
    route: 'lib/:n/src'
  };
  it( `${args.hash} > ${args.route}`, ()=> {
    returns = {
      path: 'lib/test/src',
      params: { n: 'test' },
      query: { path: '/root/file.css' }
    };
    assert.deepEqual( match( args.hash, args.route ), returns );
  });
  args = {
    hash: '#docs/api/guides?format=json',
    route: 'docs/:any/:any'
  };
  it( `${args.hash} > ${args.route}`, ()=> {
    returns = {
      path: "docs/api/guides",
      params: { $0: "api", $1: "guides" },
      query: { format: "json" }
    };
    assert.deepEqual( match( args.hash, args.route ), returns );
  });

  // Regression: '/' used to collapse to an empty path (1 part), so the root
  // route could never match and a ':page' pattern captured params.page === ''.
  args = {
    hash: '#/',
    route: '/'
  };
  it( `${args.hash} > ${args.route} (root)`, ()=> {
    returns = { path: '/', params: {}, query: {} };
    assert.deepEqual( match( args.hash, args.route ), returns );
  });

  args = {
    hash: '',
    route: '/'
  };
  it( `${JSON.stringify(args.hash)} > ${args.route} (empty hash)`, ()=> {
    returns = { path: '/', params: {}, query: {} };
    assert.deepEqual( match( args.hash, args.route ), returns );
  });

  args = {
    hash: '#/',
    route: ':page'
  };
  it( `${args.hash} > ${args.route} (wildcard no longer swallows root)`, ()=> {
    assert.deepEqual( match( args.hash, args.route ), null );
  });

  args = {
    hash: '#/home/',
    route: '/home'
  };
  it( `${args.hash} > ${args.route} (trailing slash still trimmed)`, ()=> {
    returns = { path: '/home', params: {}, query: {} };
    assert.deepEqual( match( args.hash, args.route ), returns );
  });

})
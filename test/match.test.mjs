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

})
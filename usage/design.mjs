import { match } from "../src/match.mjs";

console.group('match: basic');
  console.dir( match('#home', ':page') );
  console.dir( match('#admin', ':page') );
  console.dir( match('#login', ':page') );
  console.dir( match('#logout', ':page') );
console.groupEnd();

console.group('match: query');
  console.dir( match('#style/load?file=style.css', 'style/:action') );
  console.dir( match('#style/unload?file=style.css', 'style/:action') );
console.groupEnd();

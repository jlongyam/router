import { match } from "../src/match.mjs";

console.group('match: basic');
  console.dir( match('#home', ':page') );
  console.dir( match('#user/123/profile', 'user/:id/:view') );
console.groupEnd();

console.group('match: query');
  console.dir( match('#page/test?asset=path/to/file.js', 'page/:any') );
  console.dir( match('#lib/test/src?path=./root/file.css', 'lib/:n/src') );
console.groupEnd();

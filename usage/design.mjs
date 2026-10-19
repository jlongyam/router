import router from "../src/router.mjs";

console.group('match: basic');
  console.dir( router.match('#home', ':page') );
  console.dir( router.match('#admin', ':page') );
  console.dir( router.match('#login', ':page') );
  console.dir( router.match('#logout', ':page') );
console.groupEnd();

console.group('match: query');
  console.dir( router.match('#style/load?file=style.css', 'style/:action') );
  console.dir( router.match('#style/unload?file=style.css', 'style/:action') );
console.groupEnd();

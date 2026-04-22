# Router

A Router hash based

- `match` -> work in node
- `Router` -> work in browser

## What is different with other library

- simple
- small
- query friedly

Example using `match`:

```js
// 1
let pattern = 'lib/:n/src' // js
let url = '#lib/test/src?path=/root/file.css' // html
// 2
let result = { // Object
  path: 'lib/test/src',
  params: { n: 'test' },
  query: { path: '/root/file.css' }
}
// 3
assert.deepEqual( match( pattern, url ), result )
```

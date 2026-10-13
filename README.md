# Router

A hash based Router

## Features

- `match` -> work in node
- `Router` -> work in browser
- simple
- small
- query friedly

## Examples

Example using `match`:

```js

let pattern = 'lib/:n/src' 
let url = '#lib/test/src?path=/root/file.css' 

let result = { 
  path: 'lib/test/src',
  params: { n: 'test' },
  query: { path: '/root/file.css' }
}

assert.deepEqual( match( pattern, url ), result )
```

# Router

A hash based Router

## But why?

The the difference of this router with other hash router
is have ability to **parse sub slash after query**,

example

> `#page/test?asset=/path/to/file.js`

That slash after querty parsed properly.

## Features

- simple -> focuc to hash only
- small -> under 100 lines of code
- query friedly -> explained above
- `match` -> work in node
- `Router` -> work in browser

## Usage

<details name="usage">

<summary>Design site map</summary>

Import

```js
import { match } from '@jlbyte/router'
```

1. **Basic** design

```js
console.dir( match('#index', ':page') );
```

```js
{ path: 'index', params: { page: 'index' }, query: {} }
```

2. **Complex** design

```js
console.dir( match('#page/test?asset=path/to/file.js', 'page/:any') );
```

```js
{
  path: 'page/test',
  params: { '$0': 'test' },
  query: { asset: 'path/to/file.js' }
}
```

See usage detail in folder **usage/match.mjs**

</details>
<details name="usage">

<summary>Test design</summary>

Example:

```js

let hash = '#lib/test/src?path=./root/file.css'
let pattern = 'lib/:n/src' 
 

let result = { 
  path: 'lib/test/src',
  params: { n: 'test' },
  query: { path: './root/file.css' }
}

console.assert( match( pattern, hash ), result )
```

</details>

## CDN

- 
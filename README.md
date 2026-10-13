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

[Demo](https://jlongyam.github.io/router/usage/)

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

See usage detail in **usage/design.mjs**

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
<details name="usage">

<summary>Create route</summary>

Design:

```js
console.dir( match('#style/load?file=style.css', 'style/:action') )
```

Result:

```js
{
  path: 'style/load',
  params: { action: 'load' },
  query: { file: 'style.css' }
}
```

Implementation:

```js 
router.route('style/:action', ({ params, query })=> {
  if(params.action === 'load') {
    console.log( query.file )
  }
})
```

</details>
<details name="usage">
<summary>Manage Navigation</summary>

Example:

```js
router.navigate('#style/load?file=style.css')
```

See usage detail in **usage/route.mjs**

</details>

## Links

[CDN](https://esm.sh/@jlbyte/router@latest) .
[Website](https://jlongyam.github.io/router/) .
[Repository](https://github.com/jlongyam/router) .
[MIT](https://github.com/jlongyam/router/?tab=MIT-1-ov-file#)

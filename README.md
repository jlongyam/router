# Router

[github.com/jlongyam/router](https://github.com/jlongyam/router)

## What is this ?

Simple hash based **router** via `location.hash` change,

no  `History.pushState()`

## Usage

### HTML

```html
<script src="./Router.js"></script>
<ul>
  <li><a href="#/">Root</a></li>
  <li><a href="#/Home">Home</a></li>
</ul>
<ul>
  <li><a href="./simple.html">Reset</a></li>
</ul>
<pre id="output"></pre>
```

### Javascript

```javascript
var router = new Router({
  '#/': ()=> output.textContent = 'Index',
  '#/Home/': ()=> output.textContent = 'Welcome'
})
```

[Demo](https://jlongyam.github.io/router/test)

## Note

- Writing map **without** argument MUST ending with `'/'` slash
- Writing map **with** argument **NO** slash `'/'` at end
- There is no **404** page

## Contribute

- fork
- pull
- issue any bug
- fix

License **MIT**
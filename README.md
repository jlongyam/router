# [router](https://github.com/jlongyam/router)

## Usage

### HTML

```html
<ul>
  <li><a href="#/">Root</a></li>
  <li><a href="#/Home">Home</a></li>
  <li><a href="#/Page/About">Home</a></li>
</ul>
```

### JS

```javascript
var router = new Router({
  '#/': ()=> ... ,
  '#/Home/': ()=> ... ,
  '#/Page/:any': (any)=> ... any ... 
})
```

## Note

- Writing map __without argument:__ _Must_ ending with `'/'` slash.
- Writing map __with argument:__ _NO slash_ `'/'` at end.

[Changelog](changelog.md)
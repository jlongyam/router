'use strict'

// Deliberately ES5: this file is the script that exercises dist/router.legacy.js,
// so it must be parseable by the same engines the legacy bundle targets.
//var pre = document.querySelector('#pre')
var login = false

router.route(':page', function (result) {
  var params = result.params

  if (params.page === 'home') {
    pre.innerHTML = '<h1>Welcome Home</h1>'
    if (login) {
      pre.innerHTML += '<p><b>Unload</b> <a href="#style/unload?file=../nw/style.css">Style</a></p>'
    }
  }

  if (params.page === 'admin') {
    if (!login) {
      router.navigate('#login')
    } else {
      pre.innerHTML = '<h1>Welcome Admin</h1>'
      pre.innerHTML += '<p><b>Load</b> <a href="#style/load?file=../nw/style.css">Style</a></p>'
      pre.innerHTML += '<p><a href="#logout">Logout</a></p>'
    }
  }

  if (params.page === 'login') {
    var input = prompt('password', 123)
    if (parseInt(input, 10) === 123) {
      login = true
      router.navigate('#admin')
    } else {
      alert('Failed')
      router.navigate('#home')
    }
  }

  if (params.page === 'logout') {
    login = false
    router.navigate('#home')
  }
})

router.route('style/:action', function (result) {
  var params = result.params
  var query = result.query

  if (params.action === 'load') {
    if (!('link_style' in window)) {
      var link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = query.file
      link.id = 'link_style'
      document.head.appendChild(link)
    }
  } else {
    if ('link_style' in window) {
      document.head.removeChild(window.link_style)
    }
  }
})

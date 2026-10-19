import router from '../src/router.mjs';
// import router from 'https://esm.sh/@jlbyte/router@latest';

const pre = document.querySelector('#pre');
let login = false;
let pass = 123;

router.route(':page', ({ params })=> {
  if(params.page === 'home') {
    pre.innerHTML = '<h1>Welcome Home</h1>';
    if(login) {
      pre.innerHTML += '<p><b>Unload</b> <a href="#style/unload?file=./nw/style.css">Style</a></p>'
    }
  }
  if(params.page === 'admin') {
    if(!login) {
      router.navigate('#login')
    }
    else {
      pre.innerHTML = '<h1>Welcome Admin</h1>';
      pre.innerHTML += '<p><b>Load</b> <a href="#style/load?file=style.css">Style</a></p>'
      pre.innerHTML += '<p><a href="#logout">Logout</a></p>'
    }
  }
  if(params.page === 'login') {
    let input = prompt('password', 123);
    if( parseInt(input) === 123 ) {
      login = true;
      router.navigate('#admin')
    }
    else {
      alert('Failed');
      router.navigate('#home')
    }
  }
  if(params.page === 'logout') {
    login = false;
    router.navigate('#home');
  }
});

router.route('style/:action', ({ params, query })=> {
  if(params.action === 'load') {
    if(!('link_style' in window)) {
      let link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = query.file;
      link.id = 'link_style';
      document.head.appendChild(link)
    }
  }
  else {
    if('link_style' in window) {
      document.head.removeChild(link_style);
    }
  }
});





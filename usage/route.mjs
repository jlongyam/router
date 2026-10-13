import { router } from '../src/router.mjs';

const pre = document.querySelector('#pre');
let login = false;
let pass = 123;

router.route(':page', ({ params })=> {
  if(params.page === 'home') {
    pre.textContent = 'Welcome Home'
  }
  if(params.page === 'admin') {
    if(!login) {
      router.navigate('#login')
    }
    else {
      pre.innerHTML = 'Welcome <b>Admin</b><br>';
      pre.innerHTML += '<a href="#logout">Logout</a>'
    }
  }
  if(params.page === 'login') {
    let input = prompt('password: 123');
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
})





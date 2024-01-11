jl = (typeof jl === 'undefined') ? {} : jl
jl.router = (map = {}) => {
  const exec = (hash, vars, args) => {
    let
      maps = Object.keys(map),
      i = 0, ml = maps.length
      ;
    // Find key and cb by URL hash
    // ========================================================
    // let report = '' // DON't delete this comments
    // report += '\n'
    // report += 'location.hash: ' + location.hash + '\n'
    // report += '====================================\n'
    // report += 'hash: ' + hash + '\n'
    // report += 'vars: ' + vars + '\n'
    // report += 'args: ' + args + '\n'
    // report += '====================================\n'
    // report += 'select: ' + 'map[' + hash + args + ']' + '\n'
    // report += 'cb: (' + args + ')\n'
    // report += '====================================\n'
    // console.log(report)
    // ========================================================
    for (i; i < ml; i++) {
      try {
        if ('' + args === 'undefined') map[hash].call()
        else {
          let _args = ':' + args.join('/:')
          map[hash + _args].apply(null, vars)
        }
      }
      catch (e) {
        e.message = '\nError:'
        e.message += '\nPlease check URL writing'
        console.log(e.message)
      }
    }
  }
  const sort = (match, hash) => {
    let
      i = 0,
      ml = match.length
      ;
    for (i; i < ml; i++) {
      let
        map = match[i]['map'],
        tail = hash.substring(map.length),
        arg = match[i]['variable']
        ;
      if (tail.length === 0) {
        if (arg.length === 0) exec(map)
      }
      else {
        if (arg.length > 0) {
          let
            hash_no_tail = tail.substring(0, tail.length - 1),
            a_hash = hash_no_tail.split('/')
            ;
          if (a_hash.length === arg.length) exec(map, a_hash, arg)
        }
      }
    }
  }
  const filter = (() => {
    let
      maps = Object.keys(map),
      a = [], i = 0, l = maps.length
      ;
    for (i; i < l; i++) {
      let
        hashs = maps[i].split(':'),
        base = hashs[0],
        normalize = base.substring(base.length - 1) != '/' ? base + '/' : base,
        vars = [], u = 0, hl = hashs.length
        ;
      for (u; u < hl; u++) {
        if (hashs[u] === base) continue
        let a_hash_u = hashs[u].split('/')
        if (a_hash_u.includes('')) a_hash_u.pop()
        vars.push(a_hash_u)
      }
      a.push({
        hash: maps[i],
        base: normalize,
        variable: vars,
      })
    }
    return a
  })()
  const listenHash = () => {
    let
      hash = decodeURI(window.location.hash),
      tail = hash.substring(hash.length, hash.length - 1),
      normalize = tail === '/' ? hash : hash + '/',
      a = [], i = 0, fl = filter.length
      ;
    for (i; i < fl; i++) {
      let base = filter[i]['base']
      if (normalize.indexOf(base) != -1) {
        a.push({
          map: base,
          variable: filter[i]['variable']
        })
      }
    }
    sort(a, normalize)
    return {
      hash: hash,
      normalize: normalize,
      match: a
    }
  }
  window.addEventListener('hashchange', async () => {
    listenHash()
  })
  if (window.location.hash.length > 0) listenHash()
}
jl.router.goTo = ( toUrl )=> location.hash = toUrl
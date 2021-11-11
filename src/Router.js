class Router {
  constructor( map = {} ) {
    this.map = map
    window.addEventListener( 'hashchange', ()=> { return this._hash })
    if( window.location.hash.length > 0 ) return this._hash
  }
  _exec( hash, ahash, amap ) {
    var maps = Object.keys( this.map )
    for( var i = 0; i < maps.length; i++ ) {
      if( maps[i] === hash ) {
        if( typeof ahash != 'undefined' ) {
          var args = ':' + amap.join('/:')
          this.map[ hash + args ].apply( null, ahash )
        }
        else this.map[hash].apply()
      }
    }
  }
  _sort( match, hash ) {
    for( var i = 0; i < match.length; i++ ) {
      var map = match[i]['map']
      var tail = hash.substring( map.length )
      var arg = match[i]['variable']
      if( tail.length === 0 ) {
        if( arg.length === 0 ) this._exec( map )
      }
      else {
        if( arg.length > 0 ) {
          var hash_no_tail = tail.substring( 0, tail.length - 1)
          var a_hash = hash_no_tail.split('/')
          if( a_hash.length === arg.length ) this._exec( map, a_hash, arg )
        }
      }
    }
  }
  get _map() {
    const maps = Object.keys( this.map )
    let a = []
    for( var i = 0; i < maps.length; i++ ) {
      var hashs = maps[i].split(':')
      var base = hashs[0]
      var normalize = base.substring( base.length -1 ) != '/' ? base + '/' : base
      var vars = []
      for( var u = 0; u < hashs.length; u++ ) {
        if( hashs[u] === base ) continue;
        vars.push( hashs[u].replace('/', '') )
      }
      a.push({
        hash: maps[i],
        base: normalize,
        variable: vars,
      })      
    }
    return a
  }
  get _hash() {
    const hash = decodeURI( window.location.hash )
    var tail = hash.substring( hash.length, hash.length - 1 )
    var normalize = tail === '/' ? hash :  hash + '/'
    let a = []
    for( var i = 0; i < this._map.length; i++ ) {
      var base = this._map[i]['base']
      if( normalize.indexOf( base ) != -1 ) {
        a.push({
          map: base,
          variable: this._map[i]['variable']
        })
      }
    }
    this._sort( a, normalize )
    return {
      hash: hash,
      normalize: normalize,
      match: a
    }
  }
}
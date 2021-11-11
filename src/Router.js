class Router {
  constructor( map = {} ) {
    this.map = map
  }
  get _map() {
    const maps = Object.keys( this.map )
    let result = []
    for( var i = 0; i < maps.length; i++ ) {
      var hashs = maps[i].split(':')
      var hash_base = hashs[0]
      var hash_base_normalize = hash_base.substring( hash_base.length -1 ) != '/' ? hash_base + '/' : hash_base
      var hash_variable = []
      for( var a = 0; a < hashs.length; a++ ) {
        if( hashs[a] === hash_base ) continue;
        hash_variable.push( hashs[a].replace('/', '') )
      }
      result.push({
        hash: maps[i],
        base: hash_base_normalize,
        variable: hash_variable,
      })      
    }
    return result
  }
  _exec( hash, arg_hash, arg_map ) {
    var a_map = Object.keys( this.map )
    for( var i = 0; i < a_map.length; i++ ) {
      if( a_map[i] === hash ) {
        if( typeof arg_hash != 'undefined' ) {
          var a_args = ':' + arg_map.join('/:')
          var s_hash = hash + a_args
          this.map[s_hash].apply( null, arg_hash )
        }
        else {
          this.map[hash].apply()
        }
      }
    }
  }
  _sort( match, hash ) {
    for( var i = 0; i < match.length; i++ ) {
      var map = match[i]['map']
      var hash_tail = hash.substring( map.length )
      var arg = match[i]['variable']
      if( hash_tail.length === 0 ) { // map match no variable
        if( arg.length === 0 ) this._exec( map )//no :arg
        // don't use else
      }
      else {
        if( arg.length > 0 ) {
          var hash_no_tail = hash_tail.substring( 0, hash_tail.length - 1)
          var a_hash = hash_no_tail.split('/')
          if( a_hash.length === arg.length ) {
            this._exec( map, a_hash, arg )
          }
        }
      }
    }
  }
  get _hash() {
    const hash = decodeURI( window.location.hash )
    var tail = hash.substring( hash.length, hash.length - 1 )
    var hash_normalize = tail === '/' ? hash :  hash + '/'
    let a_match = []
    let a_map = this._map
    for( var i = 0; i < a_map.length; i++ ) {
      var map_base = a_map[i]['base']
      var map_variable = a_map[i]['variable']
      var is_include = hash_normalize.indexOf( map_base ) != -1
      if( is_include ) {
        a_match.push({
          map: map_base,
          variable: map_variable
        })
      }
    }
    this._sort( a_match, hash_normalize )
    return {
      hash: hash,
      normalize: hash_normalize,
      match: a_match
    }
  }
}

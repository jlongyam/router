// require 'window.onhashchange' polyfill

function router( s_root, o_map, b_autostart ){
  function router_map_execute( o_map_new ) {
    var s_map_var_position = o_map_new.indexOf( ':' );
    if( s_map_var_position == -1 ) o_map[ o_map_new ].call();
    else {
      var s_hash_part = window.location.hash.substring( s_map_var_position );
      var a_hash_vars = s_hash_part.split( '/' );
      o_map[ o_map_new ].apply( this, a_hash_vars );
      }
    }
  function router_map_found() {
    var s_hash = decodeURI( window.location.hash );
    var a_hash = s_hash.split('/');
    var s_result = '';
    var a_maps = Object.keys( o_map );
    for( var i = 0; i < a_maps.length; i++ ) {
      var a_map = a_maps[i].split( '/' );
      var a_pad = [];
      for( var a = 0; a < a_map.length; a++ ) {
        if( a_map[a] == a_hash[a] ) a_pad.push( a_hash[a] );
        if( a_map[a].substring( 0,1 ) == ':' ) a_pad.push( a_map[a] );
        }
      if( a_pad.length == a_hash.length ) {
        s_result = a_pad.join('/');
        break;
      }
    }
    return s_result;
    }
  function router_start() {
    var o_map_founded = router_map_found();
    router_map_execute( o_map_founded );
    }
  if( b_autostart && window.location.hash.length == 0 ) window.location = s_root;
  if( window.location.hash.length > 0 ) router_start();
	window.addEventListener( 'hashchange', router_start );
  }

/* Example
===========
router( '#/', {
  '#/': function() { console.log( 'root' ) },
  '#/home': function() { console.log( 'Welcome' ) },
  '#/chunk': function() { console.log( 'Done' ) },
  '#/:any': function( any ) { console.log( any ) },
  '#/etc/:one': function( one ) { console.log( one ) },
  '#/foo/:bar': function( bar ) { console.log( bar ) },
  '#/jack/:a/:b/:c': function( a, b, c) { console.log( a + ' ' + b + ' ' + c ) }
});
//, true });
=================================================================================
*/
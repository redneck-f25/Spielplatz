(()=>{'use strict';

[ 'log', 'info', 'warn', 'error' ].forEach( ( methodName ) => {
  const native = console.native === undefined ? console : console.native;
  const nativeMethod = native[ methodName ];
  const prefix = methodName[ 0 ].toUpperCase();
  let prevFilter, prevFilterOut;
  let filterRegExp, filterOutRegExp;
  native[ methodName ] = ( ...args ) => {
    const strings = args.filter( x => typeof x === 'string' ).join( ' ' );
    const filterOut = localStorage.__debug_ConsoleFilterOut || sessionStorage.__debug_ConsoleFilterOut;
    const filter = localStorage.__debug_ConsoleFilter || sessionStorage.__debug_ConsoleFilter;
    if ( filterOut ) {
      if ( filterOut !== prevFilterOut ) {
        prevFilterOut = filterOut;
        filterOutRegExp = new RegExp( filterOut );
      }
      if ( args.length >= 1 && filterOutRegExp.test( strings ) ) {
        return;
      }
    }
    if (filter) {
      if (filter !== prevFilter) {
        prevFilter = filter;
        filterRegExp = new RegExp( filter );
      }
      if ( args.length < 1 || !filterRegExp.test( strings ) ) {
        return;
      }
    }
    if ( strings.length > 180 ) {
      args = [ strings.slice( 0, 180 ), { '...': args }];
    }
    if ( localStorage.__debug_ConsoleTimestamps || sessionStorage.__debug_ConsoleTimestamps ) {
      args.unshift( prefix );
      args.unshift( new Date().toISOString( { withLocalTimezoneOffset: true } ) );
    }
    nativeMethod( ...args );
  }
});

})();

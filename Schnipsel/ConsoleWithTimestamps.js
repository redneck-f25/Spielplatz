[ 'log', 'info', 'warn', 'error' ].forEach( ( methodName ) => {
  const nativeMethod = console[ methodName ];
  const prefix = methodName[ 0 ].toUpperCase();
  console[ methodName ] = ( ...args ) => {
    nativeMethod( new Date().toISOString( { withLocalTimezoneOffset: true } ) + ' ' + prefix, ...args );
  }
});

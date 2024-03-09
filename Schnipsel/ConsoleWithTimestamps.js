(()=>{'use strict';

[ 'log', 'info', 'warn', 'error' ].forEach( ( methodName ) => {
  const consoleNative = console.native === undefined ? console : console.native;
  const nativeMethod = consoleNative[ methodName ];
  const prefix = methodName[ 0 ].toUpperCase();
  consoleNative[ methodName ] = ( ...args ) => {
    nativeMethod( new Date().toISOString( { withLocalTimezoneOffset: true } ) + ' ' + prefix, ...args );
  }
});

})();

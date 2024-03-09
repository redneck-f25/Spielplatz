(()=>{'use strict';

[ 'log', 'info', 'warn', 'error' ].forEach( ( methodName ) => {
  const nativeMethod = console[ methodName ];
  console[ methodName + 'Topic' ] = ( topic, ...args ) => {
    let topics = sessionStorage.__debug_ConsoleTopics;
    if ( !topics ) {
      nativeMethod( ...args );
      return;
    }
    if ( topics[ 0 ] !== ',' ) {
      if ( topics[ topics.length - 1 ] !== ',' ) {
        topics = sessionStorage.__debug_ConsoleTopics = ',' + topics + ',';
      }
      else {
        topics = sessionStorage.__debug_ConsoleTopics = ',' + topics;
      }
    }
    else if ( topics[ topics.length - 1 ] !== ',' ) {
      topics = sessionStorage.__debug_ConsoleTopics = topics + ',';
    }
    if ( topics.indexOf( ',' + topic + ',' ) >= 0 ) {
      nativeMethod( ...args );
    }
  }
  console[ methodName ] = console[ methodName + 'Topic' ].bind( undefined, undefined );
});

})();

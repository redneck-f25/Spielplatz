(()=>{'use strict';

const httpSchemeRegExp = /^http/;
const websocketScheme = 'ws';
  
const WebSocketWard = (() => ( class WebSocket extends EventTarget {
  
  #guardedHandlers = {}
  
  constructor( guardian ) {
    super();
    this.guardian = guardian;
  }
  
  #setEventHandler( type, handler ) {
    this.removeEventListener( type, this.#guardedHandlers[ type ] );
    this.addEventListener( type, this.#guardedHandlers[ type ] = handler );
  }
  
  close( code, reason )       { this.guardian.close( code, reason ); }
  send ( data )               { this.guardian.send( data ); }
  
  get binaryType    ()        { return this.guardian.binaryType; }
  set binaryType    ( value ) { this.guardian.binaryType = value; }
  get bufferedAmount()        { return this.guardian.bufferedAmount; }
  get extensions    ()        { return this.guardian.extensions; }
  get protocol      ()        { return this.guardian.protocol; }
  get readyState    ()        { return this.guardian.readyState; }
  get url           ()        { return this.guardian.url; }
  
  set onopen   ( handler ) { this.#setEventHandler( 'open', handler ); }
  get onopen   ()          { return this.#guardedHandlers[ 'open' ]; }
  set onerror  ( handler ) { this.#setEventHandler( 'error', handler ); }
  get onerror  ()          { return this.#guardedHandlers[ 'error' ]; }
  set onmessage( handler ) { this.#setEventHandler( 'message', handler ); }
  get onmessage()          { return this.#guardedHandlers[ 'message' ]; }
  set onclose  ( handler ) { this.#setEventHandler( 'close', handler ); }
  get onclose  ()          { return this.#guardedHandlers[ 'close' ]; }
  
}))();

globalThis.WebSocket = (() => ( class WebSocketGuardian extends WebSocket {
  static ArrayProxy = class ArrayProxy extends Array {
    send    ( data )         { this.at( 0 ).send( data ); }
    sendAll ( data )         { this.forEach( ( x ) => { x.readyState === WebSocket.OPEN && x.send( data ); } ) }
    close   ( code, reason ) { this.at( 0 ).close( code, reason ); }
    closeAll( code, reason ) { this.forEach( ( x ) => { x.close( code, reason ); } ) }
  }
  static ObjectProxy = class ObjectProxy extends Object {
    send    ( data )         { Object.values( this ).at( 0 ).send( data ); }
    sendAll ( data )         { Object.values( this ).forEach( ( x ) => { x.sendAll !== undefined ? x.sendAll( data ) : x.readyState === WebSocket.OPEN && x.send( data ); } ) }
    close   ( code, reason ) { Object.values( this ).at( 0 ).close( code, reason ); }
    closeAll( code, reason ) { Object.values( this ).forEach( ( x ) => { x.closeAll !== undefined ? x.closeAll( code, reason ) : x.close( code, reason ); } ) }
  }
  
  static #ConstructingWebSocket = class ConstructingWebSocket extends EventTarget {
    constructor( url, protocols ) {
      super();
      url = new URL( url, location.href.replace( httpSchemeRegExp, websocketScheme ) );
      let key = ( url.host === location.host ? '' : '//' + url.host ) + url.href.slice( url.origin.length );
      this.key = key;
      this.url = url.href;
      this.parsedUrl = url;
      this.protocols = protocols;
      this.addEventListener( 'create', WebSocketGuardian.oncreate );
    }
  }
  
  static #GuardedMessageEvent = class GuardedMessageEvent extends MessageEvent {
    
    defaultPrevented = false;
    
    get cancelable() { return true; }
    // get defaultPrevented() { return this.defaultPrevented; }
    preventDefault() { this.defaultPrevented = true; }
    
    get data() {
      return this.guardedData !== undefined ? this.guardedData : super.data;
    }
    set data( value ) {
      this.guardedData = value;
    }
  }
  
  static wards = new WebSocketGuardian.ObjectProxy()
  
  static send    ( data )         { WebSocketGuardian.wards.send( data ) }
  static sendAll ( data )         { WebSocketGuardian.wards.sendAll( data ) }
  static close   ( code, reason ) { WebSocketGuardian.wards.close( code, reason ) }
  static closeAll( code, reason ) { WebSocketGuardian.wards.closeAll( code, reason ) }
  
  static oncreate ( event ) {}
  static onopen   ( event ) {}
  static onerror  ( event ) {}
  static onmessage( event ) {}
  static onsend   ( event ) {}
  static onclose  ( event ) {}
  
  moments = { create: new Date() }
  
  constructor( url, protocols ) {
    const constructingWebSocket = new WebSocketGuardian.#ConstructingWebSocket( url, protocols );
    constructingWebSocket.dispatchEvent( new Event( 'create' ) );
    let key;
    ( { parsedUrl: url, protocols, key } = constructingWebSocket );
    
    super( url, protocols );
    this.parsedUrl = url;
    this.key = key;
    this.ward = new WebSocketWard( this );
    this.onclose   = this.#guardedOnClose;
    this.onerror   = this.#guardedOnError;
    this.onmessage = this.#guardedOnRecvMessage;
    this.onopen    = this.#guardedOnOpen;
    this.addEventListener( 'send', this.#guardedOnSendMessage );
    
    const wards = WebSocketGuardian.wards;
    if ( wards[ this.key ] === undefined ) {
      wards[ this.key ] = new WebSocketGuardian.ArrayProxy();
    }
    wards[ this.key ].unshift( this.ward );
    
    return this.ward;
  }
  
  send( data ) {
    const event = new WebSocketGuardian.#GuardedMessageEvent( 'send', { data } );
    this.dispatchEvent( event );
  }
  
  #guardedOnOpen( event ) {
    this.moments.open = new Date();
    WebSocketGuardian.onopen( event );
    this.ward.dispatchEvent( new event.constructor( event.type, event ) );
  }
  #guardedOnError( event ) {
    this.moments.error = new Date();
    WebSocketGuardian.onerror( event );
    this.ward.dispatchEvent( new event.constructor( event.type, event ) );
  }
  #guardedOnRecvMessage( event ) {
    if ( event.constructor !== WebSocketGuardian.#GuardedMessageEvent ) {
      this.moments.recv = new Date();
      let originalEvent = event;
      event = new WebSocketGuardian.#GuardedMessageEvent( originalEvent.type, originalEvent );
      event.originalEvent = originalEvent;
      originalEvent.target.dispatchEvent( event );
    }
    else {
      WebSocketGuardian.onRecvMessage( event );
      if ( event.defaultPrevented ) {
        return;
      }
      let newEvent = new MessageEvent( event.type, event );
      newEvent.originalEvent = event.originalEvent;
      this.ward.dispatchEvent( newEvent );
    }
  }
  #guardedOnSendMessage ( event ) {
    this.moments.send = new Date();
    WebSocketGuardian.onSendMessage( event );
    if ( event.defaultPrevented ) {
      return;
    }
    super.send( event.data )
  }
  #guardedOnClose( event ) {
    this.moments.close = new Date();
    WebSocketGuardian.onclose( event );
    this.ward.dispatchEvent( new event.constructor( event.type, event ) );
  }
}))();

})();

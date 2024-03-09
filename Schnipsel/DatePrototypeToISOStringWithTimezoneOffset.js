(()=>{'use strict';

/***
* new Date().toISOString( { withLocalTimezoneOffset: true } )
* new Date().toISOString( { withTimezoneOffset: true } )
* new Date().toISOString( { withTimezoneOffset: 0 } )
* new Date().toISOString( { withTimezoneOffset: 100 } )
* new Date().toISOString( { withTimezoneOffset: '+01:00' } )
* new Date().toISOString( { withTimezoneOffset: -500 } )
* new Date().toISOString( { withTimezoneOffset: '-05:00' } )
***/
Date.prototype.toISOString = ( () => {
  const DatePrototypeToISOString = Date.prototype.toISOString;
  const tzoRegExp = /^[+]?(?<sign>[-+])(?<hours>\d{0,2}?):?(?<minutes>\d{1,2})$/;
  let lastTzo, tzoMilliseconds, tzPostfix;
  function _toISOStringWithTimezoneOffset( date, tzo ) {
    if ( tzo !== lastTzo ) {
      lastTzo = tzo;
      tzoMilliseconds = tzo * 60000
      const tzoSign = tzo < 0 ? '-' : '+';
      const tzoHours = Math.abs( tzo / 60 );
      const tzoMinutes = ( tzo % 60 );
      tzPostfix = tzoSign + ( tzoHours < 10 ? '0' : '' ) + tzoHours + ( tzoMinutes < 10 ? '0' : '' ) + tzoMinutes;
    }
    return new Date( date.valueOf() + tzoMilliseconds ).toISOString().slice( 0, -1 ) + tzPostfix;
  }
  return function toISOString( options ) {
    if ( options?.withLocalTimezoneOffset ) {
      const tzo = -( this.getTimezoneOffset() );
      return _toISOStringWithTimezoneOffset( this, tzo );
    }
    else if ( options?.withTimezoneOffset !== undefined ) {
      const tzoMatch = ( '+' + ( options.withTimezoneOffset ).toString() ).match( tzoRegExp )?.groups;
      let tzo;
      if ( tzoMatch ) {
        tzo = +( tzoMatch.sign + '1' ) * ( +tzoMatch.hours * 60 + +tzoMatch.minutes );
      }
      else if ( options.withTimezoneOffset ) {
        tzo = -( this.getTimezoneOffset() );
      }
      else {
        return DatePrototypeToISOString.apply( this, arguments );
      }
      return _toISOStringWithTimezoneOffset( this, tzo );
    }
    else {
      return DatePrototypeToISOString.apply( this, arguments );
    }
  }
})();

})();

(function () {'use strict';

/***
* @source: https://github.com/redneck-f25/Spielplatz/blob/master/Schnipsel/DatePrototypeToISOStringWithTimezoneOffset.js
* new Date().toISOString( { withLocalTimezoneOffset: true } )
* new Date().toISOString( { withTimezoneOffset: true } )
* new Date().toISOString( { withTimezoneOffset: 0 } )
* new Date().toISOString( { withTimezoneOffset: 100 } )
* new Date().toISOString( { withTimezoneOffset: '+01:00' } )
* new Date().toISOString( { withTimezoneOffset: -500 } )
* new Date().toISOString( { withTimezoneOffset: '-05:00' } )
***/
Date.prototype.toISOString = ( function () {
  var DatePrototypeToISOString = Date.prototype.toISOString;
  // make RegExp Qt4.8 compatible
  var tzoRegExp = new RegExp( '^[+]?(?<sign>[-+])(?<hours>\\d{0,2}?):?(?<minutes>\\d{1,2})$'.replace( /\?<.*?>/g, '' ) );
  var lastTzo, tzoMilliseconds, tzPostfix, lastTzoOption;
  function _toISOStringWithTimezoneOffset( date, tzo ) {
    if ( tzo !== lastTzo ) {
      lastTzo = tzo;
      tzoMilliseconds = tzo * 60000
      var tzoSign = tzo < 0 ? '-' : '+';
      var tzoHours = Math.abs( tzo / 60 );
      var tzoMinutes = ( tzo % 60 );
      tzPostfix = tzoSign + ( tzoHours < 10 ? '0' : '' ) + tzoHours + ( tzoMinutes < 10 ? '0' : '' ) + tzoMinutes;
    }
    return new Date( date.valueOf() + tzoMilliseconds ).toISOString().slice( 0, -1 ) + tzPostfix;
  }
  return function toISOString( options ) {
    if ( options === undefined ) {
      options = {};
    }
    if ( options.withLocalTimezoneOffset ) {
      var tzo = -( this.getTimezoneOffset() );
      return _toISOStringWithTimezoneOffset( this, tzo );
    }
    else if ( options.withTimezoneOffset !== undefined ) {
      var tzoMatch = ( '+' + ( options.withTimezoneOffset ).toString() ).match( tzoRegExp );
      if (options.withTimezoneOffset === lastTzoOption) {
        return _toISOStringWithTimezoneOffset( this, lastTzo );
      }
      lastTzoOption = options.withTimezoneOffset;
      var tzoMatch = ( '+' + ( options.withTimezoneOffset ).toString(10) ).match( tzoRegExp );
      tzoMatch = {
        sign: tzoMatch[1],
        hours: tzoMatch[2],
        minutes: tzoMatch[3],
      };
      var tzo;
      if ( tzoMatch ) {
        tzo = +( tzoMatch.sign + '1' ) * ( +tzoMatch.hours * 60 + +tzoMatch.minutes );
        tzo = +( tzoMatch.sign + '1' ) * ( +(tzoMatch.hours.toString(10)) * 60 + +(tzoMatch.minutes.toString(10)) );
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

Date.prototype.toISOStringWithTimezoneOffset = function toISOStringWithTimezoneOffset() {
  return this.toISOString( { withLocalTimezoneOffset: true } );
}

})();

window.addEventListener( 'load', function __window_onload( event ) {
"use strict";

var out = ( text )=>( document.body.appendChild( document.createElement( 'pre' ) ).innerText = text );
out.json = ( value, space )=>( out( JSON.stringify( value, undefined, space ) ) );

class Mixin {
    static __mixin__( clazz ) {
        Object.getOwnPropertyNames( this.prototype ).forEach( ( name )=>{
            if ( name === 'constructor' ) {
                return;
            }
            Object.defineProperty( clazz.prototype, name, { value: this.prototype[ name ] } );
        });
        return clazz;
    }
}

class HiddenProperties extends Mixin {
    __HiddenProperties_wrapFunctions( methodNames, hiddenProperties ) {
        var [ me, prototype ] = [ this, Object.getPrototypeOf( this ) ];
        
        this.timestamp = new Date();
        methodNames.forEach( ( name )=>{
            Object.defineProperty( me, name, { value: function() {
                prototype[ name ].call( me, ...arguments, hiddenProperties );
            }});
        });
    }
    __HiddenProperties_extractArguments( args, numberOfExpectedArguments ) {
      	args = Array.from( args );
      	var hiddenProperties = args.pop();
        var additionalArguments = args.splice( numberOfExpectedArguments );
        var needMore = numberOfExpectedArguments - args.length;
        needMore && args.splice( args.length, 0, ...new Array( needMore ) );
        return [ ...args, additionalArguments, hiddenProperties ];
    }
}

class Class {
	constructor() {
        var hiddenProperties = {
            answer: 42,
        };
        this.__HiddenProperties_wrapFunctions(
                [
                    Class.prototype.foobar.name
                ],
                hiddenProperties
                );
    }
    foobar( a, b ) {
        var [ a, b, additionalArguments, hiddenProperties ]
            = this.__HiddenProperties_extractArguments(
                    arguments, Class.prototype.foobar.length );

        var data = { a, b, additionalArguments, hiddenProperties };
        out.json( data );
        ++hiddenProperties.answer;
    }
}

HiddenProperties.__mixin__( Class );

var instance = new Class();
out.json( instance );
instance.foobar();
instance.foobar( 1, 2, 3, 4 );
instance.foobar( 5, 6, "A", "C", "A", "B" );
instance.foobar( 7 );
Class.prototype.foobar.call( instance, { answer: 'Got ya, bitch!' } );

});

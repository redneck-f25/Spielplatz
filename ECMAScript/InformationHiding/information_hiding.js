window.addEventListener( 'load', function __window_onload( event ) {
"use strict";

var out = ( text )=>( document.body.appendChild( document.createElement( 'pre' ) ).innerText = text );
out.json = ( value, space )=>( out( JSON.stringify( value, undefined, space ) ) );

var HidingClass = ( function __module() {
    var scopes = new Map();
    var initializing = false;

    class Scope {
        constructor() {
            this.scope = this;
        }
        get( instance ) {
            return {
                priv: this.priv.get( instance ),
                prot: this.prot.get( instance ),
            }
        };
    }

    class HidingClass {
        constructor( scope, clazz ) {
            // optional argument 'scope'
            if ( clazz === undefined ) {
                // create package scope
                if ( scope === null ) {
                    scope = new Scope();
                    scope.priv = new WeakMap();
                    scope.prot = new WeakMap();
                    return scope;
                }
                clazz = scope;
                scope = undefined;
            }
            // reuse package scope
            if ( scope instanceof Scope ) {
                let newScope = new Scope()
                newScope.priv = scope.priv;
                scope = newScope;
            } else {
                scope = new Scope();
                scope.priv = new WeakMap();
            }
            scope.prot = (()=>{
                var base = clazz;
                for (;;) {
                    let tmp = Object.getPrototypeOf( base );
                    if ( tmp === Function.prototype ) {
                        break;
                    }
                    base = tmp;
                }
                var baseScope = scopes.get( base );
                if ( baseScope === undefined ) {
                    baseScope = { priv: null, prot: new WeakMap() };
                    if ( clazz !== base ) {
                        scopes.set( base, baseScope );
                    }
                }
                return baseScope.prot;
            })();
            var className = clazz.prototype.constructor.name;
            scopes.set( clazz, scope );
            scope.clazz = scope[ className ] = eval([
                '( class ' + className + ' extends clazz {',
                '    constructor() {',
                '        if  ( !initializing ) {',
                '            initializing = true;',
                '            super( ...arguments );',
                '            scope.priv.set( this, {} );',
                '            scope.prot.set( this, {} );',
                '            this.__init__( ...arguments );',
                '            initializing = false;',
                '        } else {',
                '            super( ...arguments );',
                '            scope.priv.set( this, {} );',
                '            scope.prot.set( this, {} );',
                '        }',
                '    }',
                '})',
                ].join( '\n' ) );
            return scope;
        }
    }

    return HidingClass;
})();

var packageScope = new HidingClass( null );

var Base0 = ( function __module() {
    class Base0 {
        constructor() {
            out( 'Base0.constructor' );
            this._00 = 0.1;
        }
    }
    return Base0;
})();

var Base = ( function __module() {
    var scope = new HidingClass( packageScope, class Base extends Base0{
        __init__() {
            out( 'Base.__init__' );
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            this._0 = 1;
            priv._0 = 2;
            prot._0 = 3;
        }
        foobar() {
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            out( 'Base.foobar' );
            out.json( { this: this, priv, prot } );
        }
    });
    return scope.Base;
})();

var Class1 = ( function __module() {
    var scope = new HidingClass( packageScope, class Class1 extends Base {
        __init__() {
            super.__init__();
            out( 'Class1.__init__' );
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            this._1 = 11;
            priv._1 = 12;
            prot._1 = 13;
        }
        foobar() {
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            super.foobar();
            out( 'Class1.foobar' );
            out.json( { this: this, priv, prot } );
        }
    });
    return scope.Class1;
})();

var Class2 = ( function __module() {
    class Class2 extends Class1 {
        constructor() {
            super();
            out( 'Class2.constructor' );
            this._21 = 21;
        }
        __init__() {
            super.__init__();
            out( 'Class2.__init__' );
            this._22 = 22;
        }
        foobar() {
            super.foobar();
            out( 'Class2.foobar' );
            out.json( { this: this } );
        }
    }
    return Class2;
})();

var Class3 = ( function __module() {
    var scope = new HidingClass( class Class3 extends Class2 {
        __init__() {
            super.__init__();
            out( 'Class3.__init__' );
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            this._3 = 31;
            priv._3 = 32;
            prot._3 = 33;
        }
        foobar() {
            // var { priv, prot } = scope.get( this );
            var thisScope = scope.get( this ), priv = thisScope.priv, prot = thisScope.prot;
            super.foobar();
            out( 'Class1.foobar' );
            out.json( { this: this, priv, prot } );
        }
    });
    return scope.Class3;
})();

var instance = new Class3();
instance.foobar();

});

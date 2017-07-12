// @flow 

/**
 * This module contains a type for extensible effects 
 */

/**
 * Represents an Effect.  All effects should extend from this
 */
class Reflex$Eff { }

class Reflex$Effect {
    efftypes: Array<Reflex$Eff>;

    constructor(effects: Array<Reflex$Error>) {
        this.efftypes = effects;
    }
}


/**
 * An Effect has an Eff which represents some kind of side effect or non-purity, and a return type which is pure
 * 
 * The idea when using this type is to:
 * - Make it clear that this function uses or returns something non-pure
 * - A way to isolate the pure from the impure
 * 
 * This isn't haskell, so this type is left for use by convention.
 */
class Effect<E: Eff, R> {
    eff: Eff;
    result: R;

    constructor(eff: Eff, result) {

    }
}
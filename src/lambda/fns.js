// @flow
"use strict;"

import { List } from "immutable";

const isIterable = object =>
  object != null && typeof object[Symbol.iterator] === 'function'

/**
 * Takes a nested array and flattens it.  If a nested array contains a nested array, this will be
 * flattened as well
 * [[1, 3], [4, [6, 9]], 10]
 */
function concat<T>(seqs: T | Array<T>, accum: List<T>): List<T> {
  seqs.reduce((acc: List<T>, n) => {
    if (isIterable(n))
      acc = concat(n, acc)
    else
      acc.push(n)
  }, accum)
}


function currier(fn, collected, ...args) {
    if (collected.length >= fn.length) 
        return fn(...collected)
    else if (collected.length + args.length >= fn.length) {
        let all = collected.concat(args)
        return fn(...all)
    }
    else {
        while(args.length !== 0) {
            collected.push(args.shift())
        }
        return (...rest) => {
            return currier(fn, collected, ...rest)
        }
    }
}
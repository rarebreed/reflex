# Notes on reactive 

There is a lot of similarity between reactive programming and data flows.  In fact 
one of the key catch phrases for reactive is that reactive is about the "propagation
of change".  I don't think that's quite right though.  I think a better phrase would
be "propagation of data".  Afterall, the data flowing through the computation might
not *change* per se.

It seems to me that the easist way to think about reactive is that it is a combination
of:

- functional composition 
- data flow where computation is a graph
  - the nodes are functions 
  - the outgoing edges are the return value 
  - the incoming edge is the parameter
- the implication is that a function must take only one param
  - which is the definition of a real function 


## Currying with reactive/flow 

Unfortunately, es6 and flow don't easily support currying.  Here's some of my thoughts on
how to implement this.

As an interesting aside, I learned the following with javascript:

- There is no strict arity checking with a function.  
  - You can call a function with more arguments than are declared in the definition
- Default parameters in javascript are not like named params in python 
  - To simulate named params, you have to use object notation 
- If you use default arguments, then the function.length property does not count them
  - eg function foo(x, y=10) {} will be foo.length = 1


   

```javascript
/**
 * Whenever you see deeply nested structures, think "recursion" or corecursion.
 * If we think corecursively, our starting point is a like a list, where the first element
 * is our function.  We stop when we are out of arguments.  We return a function that 
 * is partially applied if not all the args are filled.  So we have to wrap each argument
 * inside of a new function
 * 
 * Another way to look at this is we need to return the "rest of the function"
 */ 
const manuallyCurried = (fn) => {
    return (arg1) => {
        return (arg2) => {
            return (...rest) {
                return fn(arg1, arg2, ...rest);
            }
        }
    }
}



function curryHelper(fn, collected, ...rest) {
    console.log(`rest is: ${rest}`)
    console.log(`collected is: ${collected}`)
    if (collected.length < fn.length || rest.length !== 0) {
        let [arg, ...more] = rest
        collected.push(arg)
        return (arg) => {
            curryHelper(fn, collected, ...more)
        }
    }
    else 
        return fn(...collected)
}

// currier(foo, 2) where foo needs 3 args
// -> 
function currier(fn, collected, ...rest) {
    let [arg, ...more] = rest
    console.log(`rest is: ${rest}`)
    console.log(`more is: ${more}`)
    if (collected.length > fn.length && rest.length === 0) {
        return fn(...collected)
    }
    else {

    }
}
```
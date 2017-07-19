
/**
 * The base case is when we have have enough args
 * @param {**} fn
 * @param {*} collected
 * @param {*} rest
 */
function example(fn, collected, ...rest) {
    return (arg1) => {
        return (arg2) => {
            return fn(arg1, arg2)
        }
    }
}

function currier(fn, collected, ...args) {
    if (collected.length >= fn.length)
        return fn(...collected)
    else if (collected.length + args.length >= fn.length) {
        let all = collected.concat(args)
        return fn(...all)
    }
    else {
        // While I could have done recursion here with something like
        // let [args, ...more] = args for functional purity, the while loop is faster
        while (args.length !==0) {
            collected.push(args.shift())
        }
        return (...rest) => {
            return currier(fn, collected, ...rest)
        }
    }
}

function curry(fn, ...args) {
    return currier(fn, [], ...args)
}

function test() {
    function foo(x, y, z) {
        return (x + y) * z
    }
    let f = currier(foo, [])
    let answer = f(3, 4)
    console.log(answer(7))
}

console.log(__filename)
test();

/**
 * Some tips on Promises:
 * 
 * There is a link between the resolve and the then.  Whatever arg(s) gets passed into the resolved function is 
 * passed to the function that was specified in the then() handler.  Same with the reject.
 * 
 * Promises are like Monads.  I realized when trying to figure out how to actually get a value "out" of a promise.
 * You can't.  The only way to access the fulfilled portion (you can think of this as the value you pass into resolve)
 * is by creating another Promise whose resolve method makes use of it. And this method will itself always return 
 * another Promise. To put it another way, once you use a Promise you're stuck inside the Promise.
 * 
 * This is exactly what Monads do.  The definition of a Monad's bind is this:
 * bind :: Monad m => m a -> (a -> m b) -> m b
 * 
 * In english this says, given that the type m is a Monad (it follows the interface of a Monad type), then bind takes
 * a monad of type a, and a function that takes some argument of type which returns a Monad of type b, and it returns
 * a monad of type b.
 * 
 * Pheew.  Okay, let's replace that with javascript.  If I am given a Promise which uses some type a (for example a 
 * number) then I give it a method which takes a number a and possibly returns some other type b (for example a string)
 * but it always returns another Promise of this type b.  
 * 
 * Let's say I pass into my then() function something like this that converts a number to a binary string:
 * .then((x: number) => number.toString(2))
 * 
 * You might be thinking as I did "so, how do I get access to that string?".  The answer is that you have to chain 
 * _another_ function that will be passed this value.
 * 
 * somePromise
 * .then((x: number) => number.toString(2))
 * .then((s: string) => console.log(`the answer in binary is: ${s}`))
 * 
 * There is no Promise.value() or Promise.get().  You have to "reach inside the Promise" to make use of whatever values
 * your resolve (or reject) functions return.  And that's exactly how Monads work.  If you look at the definition of 
 * bind, the return value is always another (m b).  So you have to "reach into the monad" to get whatever value b is.
 * And the only way to _that_ is to call bind with the monad, and some function that takes a value of the type 
 */

var willIGetNewPhone = new Promise(
    function (resolve, reject) {
        let rand = Math.random()
        if (rand > 0.5) {
            var phone = {
                brand: 'Samsung',
                color: 'black'
            };
            resolve(phone); // fulfilled
        } else {
            var reason = new Error('mom is not happy');
            reject(reason); // reject
        }

    }
);


function showOff(phone) {
    let msg = `my new phone is a ${phone.color} ${phone.brand}!`
    return Promise.resolve(msg)
}

var phone2 = willIGetNewPhone
.then(showOff)
.then(fulfilled => console.log(`my new phone is a ${fulfilled}`))
.catch(err => console.log(err));
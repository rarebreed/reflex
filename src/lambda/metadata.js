// @flow
/**
 * This module is meant to contain functions used as decorators.  The metadata from the decorators will be stored
 * in a user-configurable location so that it can be queried by GraphQL.
 *
 * For the API, given a method module.function or module.class.method name, look up the metadata.  The query will
 * map the name to a json file (and in the future, to a orientdb database)
 */

import { curry } from "./currying"
const fs = require("fs")


/**
 * Represents some callable entity, eg a function, a class or even a script.
 */
class Code {
    path: string;
    name: string;
    description: string;
}

type FileURI = string;

type TestDefinition = {
    projectID: "RHEL6" | "RedHatEnterpriseLinux7";
    testCaseID: string;
    description: FileURI | string;
    setup: ?Code;
    teardown: ?Code;
    level: "Low" | "Medium" | "High";
    testType: "Component" | "System" | "Acceptance" | "Functional";
    features: Array<string>;
}

/**
 * A wrapper around a function to store metadata
 *
 * @param {TestDefinition} defs
 * @param {*} fn
 */
function testDefinition(defs: TestDefinition
                       , fn: Function
                       , store: string = "")
                       : Function  {
    return fn;
}

/**
 * Given a function that takes an arg of type T, and returns an R value, auto-curry it, and store the test definitions
 * in the metadata specified by the store value.  If store is left blank, or the path doesn't exist
 * 
 * @param {*} defs
 * @param {*} fn
 */
const createFn = <T, R>( defs: TestDefinition
                       , fn: Func1<T, R>
                       , store: FileURI)
                       : Func1<T, R> => {
    if (store === "") {
        fn.name
    }
    return curry(fn, [])
}

const createFn2 = <T1, T2, R>( defs: TestDefinition
                             , fn: Func2<T1, T2, R>
                             , store: string="")
                             : Func2<T1, T2, R> => {
    return fn;
}
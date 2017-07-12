// @flow

/**
 * This module is meant to contain functions used as decorators.  The metadata from the decorators will be stored 
 * in a user-configurable location so that it can be queried by GraphQL
 */

/**
 * Represents some callable entity, eg a function, a class or even a script.
 */
class Code {
    path: string
    name: string
    description: string
}

type TestDefinition = { 
    projectID: "RHEL6" | "RedHatEnterpriseLinux7";
    testCaseID: string;
    setup: ?Code;
    teardown: ?Code;
    level: "Low" | "Medium" | "High";
    testType: "Component" | "System" | "Acceptance" | "Functional";
}

/**
 * A wrapper around a function to store metadata 
 * 
 * @param {TestDefinition} defs 
 * @param {*} fn 
 */
function testDefinition(defs: TestDefinition, fn: Function, store: string = ""): Function  {
    
}

type Func1<T, R> = <T, R>(t: T) => R;

/**
 * 
 * @param {*} defs 
 * @param {*} fn 
 */
const testDefinition1 = <T, R>(defs: TestDefinition, fn: Func1<T, R>): Func1<T, R> => {
    
}
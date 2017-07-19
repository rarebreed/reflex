/************************************************************************
 * We have to represent the arity of a function this way, because a function that the number of args the fn
 * takes is part of its type
 ************************************************************************/
declare type Func1<T, R> = <T, R>(t: T) => R;
declare type Func2<T1, T2, R> = <T1, T2, R>(t1: T1, t2: T2) => R;
declare type Func3<T1, T2, T3, R> = <T1, T2, T3, R>(t1: T1, t2: T2, t3: T3) => R;
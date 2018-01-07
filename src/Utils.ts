
export type Fn0<Subject, Out> = (subject: Subject) => Out
export type Fn1<Subject, Out, A> = (a: A, subject: Subject) => Out
export type Fn2<Subject, Out, A, B> = (a: A, b: B, subject: Subject) => Out
export type Fn3<Subject, Out, A, B, C> = (a: A, b: B, c: C, subject: Subject) => Out
export type Fn4<Subject, Out, A, B, C, D> = (a: A, b: B, c: C, d: D, subject: Subject) => Out
export type Fn5<Subject, Out, A, B, C, D, E> = (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out


export type Fn<Subject, Out, A, B, C, D, E> =
    Fn0<Subject, Out>
    | Fn1<Subject, Out, A>
    | Fn2<Subject, Out, A, B>
    | Fn3<Subject, Out, A, B, C>
    | Fn4<Subject, Out, A, B, C, D>
    | Fn5<Subject, Out, A, B, C, D, E>

export type Args0<Subject, Out> = [
    Fn0<Subject, Out>, null
]

export type Args1<Subject, Out, A> = [
    Fn1<Subject, Out, A>, [A]
]

export type Args2<Subject, Out, A, B> = [
    Fn2<Subject, Out, A, B>, [A, B]
]

export type Args3<Subject, Out, A, B, C> = [
    Fn3<Subject, Out, A, B, C>, [A, B, C]
]

export type Args4<Subject, Out, A, B, C, D> = [
    Fn4<Subject, Out, A, B, C, D>, [A, B, C, D]
]

export type Args5<Subject, Out, A, B, C, D, E> = [
    Fn5<Subject, Out, A, B, C, D, E>, [A, B, C, D, E]
]


export type Args<Subject, Out, A, B, C, D, E> =
    Args0<Subject, Out>
    | Args1<Subject, Out, A>
    | Args2<Subject, Out, A, B>
    | Args3<Subject, Out, A, B, C>
    | Args4<Subject, Out, A, B, C, D>
    | Args5<Subject, Out, A, B, C, D, E>



export function combineArgs<A, B, C>(args1: Args<A, B, any, any, any, any, any>, args2: Args<B, C, any, any, any, any, any>): Args<A, C, any, any, any, any, any> {
    const [fn1, fnArgs1] = args1;
    const [fn2, fnArgs2] = args2;

    let boundFn1: Fn0<A, B>;
    if (fnArgs1 === null) {
        boundFn1 = fn1 as Fn0<A, B>;
    } else {
        fnArgs1.unshift(null)
        boundFn1 = Function.bind.apply(fn1, fnArgs1);
    }

    let boundFn2: Fn0<B, C>;
    if (fnArgs2 === null) {
        boundFn2 = fn2 as Fn0<B, C>;
    } else {
        fnArgs2.unshift(null)
        boundFn2 = Function.bind.apply(fn2, fnArgs2);
    }

    const newFn: Fn0<A, C> = (a: A) => boundFn2(boundFn1(a));
    return [newFn, null];
}

function reduceArgs(args: Args<any, any, any, any, any, any, any>[]): Args<any, any, any, any, any, any, any> {
    if (args.length === 0) {
        throw new Error("You have to provide at least one args to the chain.");
    }

    if (args.length === 1) {
        return args[0];
    }

    return args.reduce(combineArgs);
}

export function chain2<A, B, C>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>): Args<A, C, any, any, any, any, any> {

    return reduceArgs([args1, args2]);
}

export function call2<A, B, C>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    a: A): C {

    return call(chain2(args1, args2), a);
}

export function chain3<A, B, C, D>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>): Args<A, D, any, any, any, any, any> {

    return reduceArgs([args1, args2, args3]);
}

export function call3<A, B, C, D>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    a: A): D {

    return call(chain3(args1, args2, args3), a);
}

export function chain4<A, B, C, D, E>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>): Args<A, E, any, any, any, any, any> {

    return reduceArgs([args1, args2, args3, args4]);
}

export function call4<A, B, C, D, E>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    a: A): E {

    return call(chain4(args1, args2, args3, args4), a);
}

export function chain5<A, B, C, D, E, F>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>): Args<A, F, any, any, any, any, any> {

    return reduceArgs([args1, args2, args3, args4, args5]);
}

export function call5<A, B, C, D, E, F>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>,
    a: A): F {

    return call(chain5(args1, args2, args3, args4, args5), a);
}

export function chain6<A, B, C, D, E, F, G>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>,
    args6: Args<F, G, any, any, any, any, any>): Args<A, G, any, any, any, any, any> {

    return reduceArgs([args1, args2, args3, args4, args5, args6]);
}

export function call6<A, B, C, D, E, F, G>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>,
    args6: Args<F, G, any, any, any, any, any>,
    a: A): G {

    return call(chain6(args1, args2, args3, args4, args5, args6), a);
}

export function chain7<A, B, C, D, E, F, G, H, I>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>,
    args6: Args<F, G, any, any, any, any, any>,
    args7: Args<H, I, any, any, any, any, any>): Args<A, I, any, any, any, any, any> {

    return reduceArgs([args1, args2, args3, args4, args5, args6, args7]);
}

export function call7<A, B, C, D, E, F, G, H, I>(
    args1: Args<A, B, any, any, any, any, any>,
    args2: Args<B, C, any, any, any, any, any>,
    args3: Args<C, D, any, any, any, any, any>,
    args4: Args<D, E, any, any, any, any, any>,
    args5: Args<E, F, any, any, any, any, any>,
    args6: Args<F, G, any, any, any, any, any>,
    args7: Args<H, I, any, any, any, any, any>,
    a: A): I {

    return call(chain7(args1, args2, args3, args4, args5, args6, args7), a);
}

export function call<Subject, Out>(args: Args<Subject, Out, any, any, any, any, any>, subject: Subject): Out {
    const [fn, fnArgs] = args;

    // This is the case for Fn0. A function that takes no extra args besides the subject.
    if (fnArgs === null) {
        return fn.call(fn, subject);
    } else {
        fnArgs.push(subject);
        return fn.apply(fn, fnArgs);
    }
}

export function apply<Subject, Out>(args: Args<Subject, Out, any, any, any, any, any>[], subject: Subject): Out {
    return args.reduce((accumulation: Subject, currentArg: Args<Subject, Out, any, any, any, any, any>) => {
        const [fn, fnArgs] = currentArg;

        // This is the case for Fn0. A function that takes no extra args besides the subject.
        if (fnArgs === null) {
            return fn.call(fn, accumulation);
        } else {
            fnArgs.push(accumulation);
            return fn.apply(fn, fnArgs);
        }
    }, subject);
}

export function arg<Subject, Out>(fn: Fn0<Subject, Out>): Args0<Subject, Out> {
    return [fn, null];
}

export function arg1<Subject, Out, A>(fn: Fn1<Subject, Out, A>, a: A): Args1<Subject, Out, A> {
    return [fn, [a]];
}

export function arg2<Subject, Out, A, B>(fn: Fn2<Subject, Out, A, B>, a: A, b: B): Args2<Subject, Out, A, B> {
    return [fn, [a, b]];
}

export function arg3<Subject, Out, A, B, C>(fn: Fn3<Subject, Out, A, B, C>, a: A, b: B, c: C): Args3<Subject, Out, A, B, C> {
    return [fn, [a, b, c]];
}

export function arg4<Subject, Out, A, B, C, D>(fn: Fn4<Subject, Out, A, B, C, D>, a: A, b: B, c: C, d: D): Args4<Subject, Out, A, B, C, D> {
    return [fn, [a, b, c, d]];
}

export function arg5<Subject, Out, A, B, C, D, E>(fn: Fn5<Subject, Out, A, B, C, D, E>, a: A, b: B, c: C, d: D, e: E): Args5<Subject, Out, A, B, C, D, E> {
    return [fn, [a, b, c, d, e]];
}

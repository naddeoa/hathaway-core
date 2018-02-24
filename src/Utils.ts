export function apply<Subject>(subject: Subject, args: Array<(subject: Subject) => Subject>): Subject {
    return args.reduce((accumulation: Subject, currentFn) => currentFn(accumulation), subject);
}

export function pipe<Subject, Out>(subject: Subject, fn1: (subject: Subject) => Out): Out;
export function pipe<Subject, Out, A>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => Out): Out;
export function pipe<Subject, Out, A, B>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => Out): Out;
export function pipe<Subject, Out, A, B, C>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => Out): Out;
export function pipe<Subject, Out, A, B, C, D>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => Out): Out;
export function pipe<Subject, Out, A, B, C, D, E>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => E, fn6: (e: E) => Out): Out;
export function pipe<Subject, Out, A, B, C, D, E, F>(subject: Subject, fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => E, fn6: (e: E) => F, fn7: (f: F) => Out): Out;

export function pipe<Subject, Out, A, B, C, D, E, F>(subject: Subject, fn1: (subject: Subject) => A, fn2?: (a: A) => B, fn3?: (b: B) => C, fn4?: (c: C) => D, fn5?: (d: D) => E, fn6?: (e: E) => F, fn7?: (f: F) => Out): Out {
    if (fn7 !== undefined && fn6 !== undefined && fn5 !== undefined && fn4 !== undefined && fn3 !== undefined && fn2 !== undefined) {
        return fn7(fn6(fn5(fn4(fn3(fn2(fn1(subject)))))));
    }

    if (fn6 !== undefined && fn5 !== undefined && fn4 !== undefined && fn3 !== undefined && fn2 !== undefined) {
        return fn6(fn5(fn4(fn3(fn2(fn1(subject)))))) as any;
    }
    if (fn5 !== undefined && fn4 !== undefined && fn3 !== undefined && fn2 !== undefined) {
        return fn5(fn4(fn3(fn2(fn1(subject))))) as any;
    }
    if (fn4 !== undefined && fn3 !== undefined && fn2 !== undefined) {
        return fn4(fn3(fn2(fn1(subject)))) as any;
    }
    if (fn3 !== undefined && fn2 !== undefined) {
        return fn3(fn2(fn1(subject))) as any;
    }
    if (fn2 !== undefined) {
        return fn2(fn1(subject)) as any;
    }

    return fn1(subject) as any;
}

export function compose<Subject, Out, A>(fn1: (subject: Subject) => A, fn2: (a: A) => Out): (subject: Subject) => Out;
export function compose<Subject, Out, A, B>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => Out): (subject: Subject) => Out;
export function compose<Subject, Out, A, B, C>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => Out): (subject: Subject) => Out;
export function compose<Subject, Out, A, B, C, D>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => Out): (subject: Subject) => Out;
export function compose<Subject, Out, A, B, C, D, E>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => E, fn6: (e: E) => Out): (subject: Subject) => Out;
export function compose<Subject, Out, A, B, C, D, E, F>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3: (b: B) => C, fn4: (c: C) => D, fn5: (d: D) => E, fn6: (e: E) => F, fn7: (f: F) => Out): (subject: Subject) => Out;

export function compose<Subject, Out, A, B, C, D, E, F>(fn1: (subject: Subject) => A, fn2: (a: A) => B, fn3?: (b: B) => C, fn4?: (c: C) => D, fn5?: (d: D) => E, fn6?: (e: E) => F, fn7?: (f: F) => Out): (subject: Subject) => Out {
    if (fn7 !== undefined && fn6 !== undefined && fn5 !== undefined && fn4 !== undefined && fn3 !== undefined) {
        return (subject: Subject) => fn7(fn6(fn5(fn4(fn3(fn2(fn1(subject))))))) as any;
    }

    if (fn6 !== undefined && fn5 !== undefined && fn4 !== undefined && fn3 !== undefined) {
        return (subject: Subject) => fn6(fn5(fn4(fn3(fn2(fn1(subject)))))) as any;
    }

    if (fn5 !== undefined && fn4 !== undefined && fn3 !== undefined) {
        return (subject: Subject) => fn5(fn4(fn3(fn2(fn1(subject))))) as any;
    }

    if (fn4 !== undefined && fn3 !== undefined) {
        return (subject: Subject) => fn4(fn3(fn2(fn1(subject)))) as any;
    }

    if (fn3 !== undefined) {
        return (subject: Subject) => fn3(fn2(fn1(subject))) as any;
    }

    return (subject: Subject) => fn2(fn1(subject)) as any;
}


export function f<Subject, Out>(fn: (subject: Subject) => Out): (subject: Subject) => Out;

export function f<Subject, Out, A>(fn: (a: A, subject: Subject) => Out, a: A): (subject: Subject) => Out;

export function f<Subject, Out, A, B>(fn: (a: A, b: B, subject: Subject) => Out, a: A, b: B): (subject: Subject) => Out;
export function f<Subject, Out, A, B>(fn: (a: A, b: B, subject: Subject) => Out, a: A): (b: B, subject: Subject) => Out;

export function f<Subject, Out, A, B, C>(fn: (a: A, b: B, c: C, subject: Subject) => Out, a: A, b: B, c: C): (subject: Subject) => Out;
export function f<Subject, Out, A, B, C>(fn: (a: A, b: B, c: C, subject: Subject) => Out, a: A, b: B): (c: C, subject: Subject) => Out;
export function f<Subject, Out, A, B, C>(fn: (a: A, b: B, c: C, subject: Subject) => Out, a: A): (b: B, c: C, subject: Subject) => Out;

export function f<Subject, Out, A, B, C, D>(fn: (a: A, b: B, c: C, d: D, subject: Subject) => Out, a: A, b: B, c: C, d: D): (subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D>(fn: (a: A, b: B, c: C, d: D, subject: Subject) => Out, a: A, b: B, c: C): (d: D, subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D>(fn: (a: A, b: B, c: C, d: D, subject: Subject) => Out, a: A, b: B): (c: C, d: D, subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D>(fn: (a: A, b: B, c: C, d: D, subject: Subject) => Out, a: A): (b: B, c: C, d: D, subject: Subject) => Out;

export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a: A, b: B, c: C, d: D, e: E): (subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a: A, b: B, c: C, d: D): (e: E, subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a: A, b: B, c: C): (d: D, e: E, subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a: A, b: B): (c: C, d: D, e: E, subject: Subject) => Out;
export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a: A): (b: B, c: C, d: D, e: E, subject: Subject) => Out;

export function f<Subject, Out, A, B, C, D, E>(fn: (a: A, b: B, c: C, d: D, e: E, subject: Subject) => Out, a?: A, b?: B, c?: C, d?: D, e?: E): (subject: Subject) => Out {
    if (e === undefined && d === undefined && c === undefined && b === undefined && a === undefined) {
        return fn as any;
    }

    if (e === undefined && d === undefined && c === undefined && b === undefined) {
        return fn.bind(fn, a);
    }
    if (e === undefined && d === undefined && c === undefined) {
        return fn.bind(fn, a, b);
    }
    if (e === undefined && d === undefined) {
        return fn.bind(fn, a, b, c);
    }
    if (e === undefined) {
        return fn.bind(fn, a, b, c, d);
    }

    return fn.bind(fn, a, b, c, d, e);
}


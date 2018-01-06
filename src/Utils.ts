
type Fn1<Subject, A> = (a: A, subject: Subject) => Subject
type Fn2<Subject, A, B> = (a: A, b: B, subject: Subject) => Subject
type Fn3<Subject, A, B, C> = (a: A, b: B, c: C, subject: Subject) => Subject


const tt: Fn1<string, string> = (a, b) => a

type Fn<Subject, A, B, C> =
    Fn1<Subject, A>
    | Fn2<Subject, A, B>
    | Fn3<Subject, A, B, C>;


type Args1<Subject, A> = [
    Fn1<Subject, A>, [A]
]

type Args2<Subject, A, B> = [
    Fn2<Subject, A, B>, [A, B]
]

type Args3<Subject, A, B, C> = [
    Fn3<Subject, A, B, C>, [A, B, C]
]


type Args<Subject, A, B, C> =
    Args3<Subject, A, B, C>
    | Args2<Subject, A, B>
    | Args1<Subject, A>;


function apply<Subject, A, B, C>(subject: Subject, args: Args<Subject, any, any, any>[]): Subject {
    return args.reduceRight((arg: Args<Subject, any, any, any>) => {
        const fn = arg[0];
        const fnArgs = arg[1];
        return fn.apply(null, fnArgs.push(subject));
    }, subject);
}

function arg1<Subject, A>(fn: Fn1<Subject, A>, a: A): Args1<Subject, A> {
    return [fn, [a]];
}

function arg2<Subject, A, B>(fn: Fn2<Subject, A, B>, a: A, b: B): Args2<Subject, A, B> {
    return [fn, [a, b]];
}

function arg3<Subject, A, B, C>(fn: Fn3<Subject, A, B, C>, a: A, b: B, c: C): Args3<Subject, A, B, C> {
    return [fn, [a, b, c]];
}

type Something = {
    foo: string,
    bar: string
}

const subject: Something = {
    foo: 'foo',
    bar: 'bar'
};

function doSomething(thing: string, subject: Something): Something {
    return subject;
}

function doSomething2(thing: number, subject: Something): Something {
    return subject;
}

function threeArgs(thing: string, n: number, n2: number, subject: Something): Something {
    return subject;
}

function twoArgs(n: number, s: string, subject: Something): Something {
    return subject;
}


apply(subject, [
    arg1(doSomething, 'a'),
    arg3(threeArgs, 'a', 4, 3),
    arg1(doSomething2, 3),
    arg1(doSomething, 'b'),
    arg2(twoArgs, 3, '3')
])



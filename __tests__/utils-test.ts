import { call, call3, chain2, chain3, apply, arg, arg1, arg2, arg3, arg4, arg5, Args0, Args1, Args, Args2 } from '../src/Utils';

function sum(n1: number, n2: number): number {
  return n1 + n2;
}


test('Single fn', () => {
  const actualSum = apply([
    arg1(sum, 1),
    arg1(sum, 1),
    arg1(sum, 1),
    arg1(sum, 1)
  ], 2)

  expect(actualSum).toBe(6);
});


test('Make sure order respected', () => {
  function zeroOutIf2(n1: number): number {
    return n1 === 2 ? 0 : n1;
  }

  const actualSum = apply([
    arg(zeroOutIf2),
    arg1(sum, 1),
    arg1(sum, 1),
    arg1(sum, 1)
  ], 2)

  expect(actualSum).toBe(3);
});


test('Chain works same as call', () => {
  type WeirdThing = { newThing: number };

  function a(n: number, s: string): number {
    return Number.parseInt(s);
  }

  function b(s: number, c: number): WeirdThing {
    return { newThing: c };
  }

  function c(weirdThing: WeirdThing): string {
    return `${weirdThing.newThing}`;
  }

  const arga: Args1<string, number, number> = arg1(a, 1);
  const argb: Args1<number, { newThing: number }, number> = arg1(b, 2);

  const actual = call(chain3<string, number, WeirdThing, string>(
    arg1(a, 1),
    arg1(b, 2),
    arg(c)),
    '2');

  const callActual = call3<string, number, WeirdThing, string>(
    arg1(a, 1),
    arg1(b, 2),
    arg(c),
    '2');

  const expected = '2'

  expect(actual).toBe(expected);
  expect(actual).toBe(callActual);
});


test('Different arg lengths', () => {

  function arity1(s1: string, subject: string, ): string {
    return subject + s1;
  }

  function arity2(s1: string, s2: string, subject: string): string {
    return subject + s1 + s2;
  }

  function arity3(s1: string, s2: string, s3: string, subject: string): string {
    return subject + s1 + s2 + s3;
  }

  function arity4(s1: string, s2: string, s3: string, s4: string, subject: string): string {
    return subject + s1 + s2 + s3 + s4;
  }

  function arity5(s1: string, s2: string, s3: string, s4: string, s5: string, subject: string): string {
    return subject + s1 + s2 + s3 + s4 + s5;
  }


  const actualSum = apply([
    arg1(arity1, '1'),
    arg2(arity2, '1', '2'),
    arg3(arity3, '1', '2', '3'),
    arg4(arity4, '1', '2', '3', '4'),
    arg5(arity5, '1', '2', '3', '4', '5'),
  ], 'start')

  expect(actualSum).toBe('start112123123412345');
});


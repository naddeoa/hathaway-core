import { chain, pipe, apply, f } from '../src/Utils';

function sum(n1: number, n2: number): number {
  return n1 + n2;
}

test('Single fn', () => {
  const actualSum = apply(2, [
    f(sum, 1),
    f(sum, 1),
    f(sum, 1),
    f(sum, 1)
  ])

  expect(actualSum).toBe(6);
});


test('Make sure order respected', () => {
  function zeroOutIf2(n1: number): number {
    return n1 === 2 ? 0 : n1;
  }

  const actualSum = apply(2, [
    f(zeroOutIf2),
    f(sum, 1),
    f(sum, 1),
    f(sum, 1)
  ])

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

  const cc = chain(
    f(a, 1),
    f(b, 2),
    f(c));

  const actual = pipe('2', chain(
    f(a, 1),
    f(b, 2),
    c, ));

  const callActual = pipe('2',
    f(a, 1),
    f(b, 2),
    c);

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


  const actualSum = apply('start', [
    f(arity1, '1'),
    f(arity2, '1', '2'),
    f(arity3, '1', '2', '3'),
    f(arity4, '1', '2', '3', '4'),
    f(arity5, '1', '2', '3', '4', '5'),
  ])

  expect(actualSum).toBe('start112123123412345');
});


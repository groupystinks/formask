import { keyEqual, objectDeepEqual } from '../helpers/equal';

test(`
  Check two object's key equality.
`, () => {
  const a = {
    foo: { nested: { bar: 'bar' } },
    qoo: 'qoo'
  }

  const b = {
    foo: { noob: { bar: 'bar' } }
  }

  const c = {
    foo: { nut: { bar: 'bar' } },
    qoo: 'cool'
  }
  expect(keyEqual(a,b)).toEqual(false);
  expect(keyEqual(a,c)).toEqual(true);
});

test(`
  Deep
`, () => {
  const noop = () => {}
  const a = {
    foo: {
      nested: { bar: 'bar' },
      lol: [1, 2]
    },
    far: 'far',
    qoo: 2,
    func: noop,
  }

  const b = {
    foo: {
      nested: { bar: 'bar' },
      lol: [1, 2]
    },
    far: 'far',
    qoo: 2,
    func: noop,
  }

  expect(objectDeepEqual(a,b)).toEqual(true);
})

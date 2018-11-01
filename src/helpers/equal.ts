import { isObject } from '../utils';

function getkeys(obj: Object) {return Object.keys(obj); }

function isPrimitive(test: {}) {
  return (test !== Object(test));
}

export function keyEqual(a: Object, b: Object) {
  let equal = true;

  if (getkeys(a).length !== getkeys(b).length) { return false; }

  for (let key in a) {
    if (key in b) {
      continue;
    }
    equal = false;
  }

  for (let key in b) {
    if (key in a) {
      continue;
    }
    equal = false;
  }
  return equal;
}

export function objectDeepEqual(a: Object, b: Object) {
  if (!(isObject(a) && isObject(b))) {
    return false;
  }

  function traverse(aa: {}, bb: {}) {
    if (aa === bb) {return true; }

    if (
      (isPrimitive(aa) && isPrimitive(bb)) ||
      typeof aa === 'function' && typeof bb === 'function'
    ) {
      return aa === bb;
    }

    const isKeyEqual = keyEqual(aa, bb);
    if (!isKeyEqual) { return isKeyEqual; }

    const keys = getkeys(aa);
    const length = keys.length;

    for (let i = length; i-- !== 0;) {
      const key = keys[i];
      if (!traverse(aa[key], bb[key])) {
        return false;
      }
    }

    return true;
  }

  return traverse(a, b);
}

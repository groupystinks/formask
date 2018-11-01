const EMPTY_TYPES = {
  object: {},
  string: '',
  array: [],
  number: 0,
};

export function getEmptyValueFromType(type: string): string | {} | Array<undefined> | number {
  return EMPTY_TYPES[type];
}

export function getType(target: string | {} | Array<undefined> | number) {
  // For example, [object Array]​​​​​ will be split into ['[object', 'Array]'].
  const [ , back ] = Object.prototype.toString.call(target).split(' ');
  const type = back && back.replace(']', '').toLowerCase();
  return type;
}

export function getCleanValueFromTypes(typesObj: {[field: string]: string; }): Object {
  return Object.keys(typesObj).reduce(
    (accu, typekey) => {
      accu[typekey] = getEmptyValueFromType(typesObj[typekey]);
      return accu;
    },
    {}
  );
}
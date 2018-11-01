// arg could be any, so we need to find out what it is.
// tslint:disable-next-line:no-any
export const isString = (arg: any) => Object.prototype.toString.call(arg) === '[object String]';
// tslint:disable-next-line:no-any
export const isArray = (arg: any) => Object.prototype.toString.call(arg) === '[object Array]';
// tslint:disable-next-line:no-any
export const isObject =  (arg: any) => Object.prototype.toString.call(arg) === '[object Object]';

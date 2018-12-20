import { ErrorMessages } from '../formask';

/**
 * @todo: Proxy need polyfills
 * https://github.com/GoogleChrome/proxy-polyfill
 */
export function getErrorProxy(errors: ErrorMessages) {
  const errorProxyHandler = {
    get: function(obj: ErrorMessages, field: string) {
      return typeof obj[field] === 'undefined' ? {} : obj[field];
    },
    set: function(obj: ErrorMessages, field: string, value: {}) {
        obj[field] = value;
        return true;
    }
  };
  return new Proxy(errors, errorProxyHandler);
}

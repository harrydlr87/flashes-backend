export const isUndefined = value => typeof value === 'undefined';

export const isObject = value => typeof value === 'object' && value !== null;

export const isBoolean = value => typeof value === 'boolean';

export const isNumber = value => typeof value === 'number';

export const isArray = value => isObject(value) && value.constructor === Array;

export const isFunction = value => typeof value === 'function';

// Simple key converters for JS object <-> DB records

const toCamelCase = (s: string) => s.replace(/(_\w)/g, k => k[1].toUpperCase());
const toSnakeCase = (s: string) => s.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertKeys = (obj: any, converter: (key: string) => string): any => {
    if (Array.isArray(obj)) {
        return obj.map(v => convertKeys(v, converter));
    } else if (obj !== null && obj.constructor === Object) {
        return Object.keys(obj).reduce((acc, key) => {
            const newKey = converter(key);
            acc[newKey] = convertKeys(obj[key], converter);
            return acc;
        }, {} as any);
    }
    return obj;
};

export const toCamel = (obj: any) => convertKeys(obj, toCamelCase);
export const toSnake = (obj: any) => convertKeys(obj, toSnakeCase);

export const formatStatus = (status: string): string => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
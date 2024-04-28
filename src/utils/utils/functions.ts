import { filterXSS } from "xss";

export function isNullOrUndefined(value: any): boolean {
  return value === null || value === undefined;
}

export function isValid<T>(value: T): value is NonNullable<T> {
  return !isNullOrUndefined(value);
}

export function isValidForNullables<T>(
  value: T | null,
): value is NonNullable<T> | null {
  return value !== undefined;
}

export function removeValues(
  obj: object,
  includes: any[] = [],
  ignores: any[] = [null, undefined, ''],
): object {
  const isNonEmpty = (d) =>
    includes.includes(d) ||
    (!ignores.includes(d) && (typeof d !== 'object' || Object.keys(d).length));

  return JSON.parse(JSON.stringify(obj), (_k, v) => {
    if (isNonEmpty(v)) return v;
  });
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunked: T[][] = [];

  for (const element of array) {
    const last = chunked[chunked.length - 1];

    if (last && last.length !== size) last.push(element);
    else chunked.push([element]);
  }

  return chunked;
}

export function mapObjects<T, K extends keyof T>(
  objects: T[],
  key: K,
): Map<T[K], T> {
  if (!Array.isArray(objects)) return new Map();

  return new Map(objects.map((o) => [o[key], o]));
}

export function mapStackObjectsByKey<T, K extends keyof T>(
  objects: T[],
  key: K,
): Map<T[K], T[]> {
  return objects.reduce((byKey, current) => {
    const value = byKey.get(current[key]);

    if (value) {
      value.push(current);
    } else {
      byKey.set(current[key], [current]);
    }

    return byKey;
  }, new Map<T[K], T[]>());
}

export function getUniqueObjects<T extends object, K extends keyof T>(
  arr: T[],
  propToCompare: K,
): T[] {
  const uniqueObjects: Map<T[K], T> = new Map();

  for (const obj of arr) {
    const propValue = obj[propToCompare];

    if (!uniqueObjects.has(propValue)) {
      uniqueObjects.set(propValue, obj);
    }
  }

  return Array.from(uniqueObjects.values());
}

export function listEnumValues<T extends object>(
  enumObject: T,
): Array<T[keyof T]> {
  return Object.keys(enumObject).map((key) => enumObject[key]);
}

export function getCleanedString(value: string): string {
  return filterXSS(value.trim().toLowerCase());
}

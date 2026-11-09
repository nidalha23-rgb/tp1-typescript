import type { NewSpell } from "./types";

// Exercice 4 — Validate spell power: reject a spell when its power is negative.
export function ValidateSpellPower(
  _target: object,
  _propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value as (spell: NewSpell) => unknown;

  descriptor.value = function (spell: NewSpell) {
    if (spell.power < 0) {
      throw new Error(`Invalid spell power: ${spell.power}. Power must not be negative.`);
    }
    return original.apply(this, [spell]);
  };

  return descriptor;
}

// Exercice 5 — Cache method results per instance using a Map keyed by serialized args.
export function Cache(
  _target: object,
  propertyKey: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  const original = descriptor.value as (...args: unknown[]) => unknown;
  const store = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (...args: unknown[]) {
    let cache = store.get(this);
    if (!cache) {
      cache = new Map<string, unknown>();
      store.set(this, cache);
    }

    const key = `${propertyKey}:${JSON.stringify(args)}`;
    if (cache.has(key)) {
      console.log(`[Cache] hit for ${key}`);
      return cache.get(key);
    }

    console.log(`[Cache] miss for ${key}`);
    const result = original.apply(this, args);
    cache.set(key, result);
    return result;
  };

  return descriptor;
}

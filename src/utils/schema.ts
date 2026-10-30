/**
 * Minimal, dependency-free schema check: verifies required keys exist with the expected JS type.
 * A trailing "?" (e.g. "string?") marks the field as nullable.
 * Returns human-readable problems so a failing test explains exactly what drifted.
 */
type BaseType = 'string' | 'number' | 'boolean' | 'object' | 'array';
export type FieldType = BaseType | `${BaseType}?`;

export function validateShape(obj: Record<string, unknown>, shape: Record<string, FieldType>): string[] {
  const problems: string[] = [];
  for (const [key, spec] of Object.entries(shape)) {
    const nullable = spec.endsWith('?');
    const expected = spec.replace('?', '');
    if (!(key in obj)) {
      problems.push(`missing "${key}"`);
      continue;
    }
    const value = obj[key];
    if (value === null && nullable) continue;
    const actual = Array.isArray(value) ? 'array' : value === null ? 'null' : typeof value;
    if (actual !== expected) problems.push(`"${key}" expected ${spec} but got ${actual}`);
  }
  return problems;
}

export const parsePositiveInt = (value: unknown, fallback: number): number => {
  if (typeof value !== 'string') {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
};

/**
 * Validates that a path param is a positive integer string.
 * Returns the numeric id or null if invalid.
 */
export const parsePathId = (value: unknown): number | null => {
  if (typeof value !== 'string') return null;
  if (!/^\d+$/.test(value)) return null;
  const n = Number.parseInt(value, 10);
  return n > 0 ? n : null;
};

export const parseOptionalQueryString = (value: unknown): string | undefined => {
  if (typeof value !== 'string') {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
};

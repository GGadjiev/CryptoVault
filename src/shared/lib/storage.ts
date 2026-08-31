export const readStorage = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== typeof fallback) return fallback;

    return parsed as T
  } catch {
    return fallback;
  }
}

export const writeStorage = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}
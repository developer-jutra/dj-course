// Central place to configure URLs that should be ignored by logs/metrics
export const URL_METRICS_BLACKLIST: string[] = [
  '/favicon.ico',
];

export const isBlacklistedPath = (path: string | undefined | null): boolean => {
  if (!path) return false;
  return URL_METRICS_BLACKLIST.includes(path);
}

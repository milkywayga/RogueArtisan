/// <reference types="vite/client" />

const deploymentBase = (import.meta.env.BASE_URL || '/').replace(/\/$/, '');

/**
 * Keep public assets and full-document links working both at the domain root
 * and from a GitHub Pages project path such as /rogue-artisan/.
 */
export function sitePath(path: string) {
  if (!path.startsWith('/')) return path;
  return `${deploymentBase}${path}` || path;
}

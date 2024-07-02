import { dirname } from 'node:path';

export function forgivingDirectory(pathString) {
  if (pathString.endsWith('.env.keys')) {
    return dirname(pathString);
  }

  return pathString;
}

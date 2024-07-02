import { shell } from '../shared/shell.js';

export async function gitUrl(cwd = process.cwd()) {
  try {
    const raw = await shell('git', ['remote', 'get-url', 'origin'], { cwd });

    return raw.stdout.trim();
  } catch {
    return null;
  }
}

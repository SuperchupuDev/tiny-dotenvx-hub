import { shell } from '../shared/shell.js';

export async function gitUrl() {
  try {
    const raw = await shell('git', ['remote', 'get-url', 'origin']);

    return raw.stdout.trim();
  } catch {
    return null;
  }
}

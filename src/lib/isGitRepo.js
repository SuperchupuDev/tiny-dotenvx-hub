import { shell } from '../shared/shell.js';

export async function isGitRepo(cwd = process.cwd()) {
  try {
    const raw = await shell('git', ['rev-parse', '--is-inside-work-tree'], {
      cwd,
      stderr: 'ignore'
    });
    return raw.stdout.trim() === 'true';
  } catch {
    return false;
  }
}

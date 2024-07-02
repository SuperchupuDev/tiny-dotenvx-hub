import { shell } from '../shared/shell.js';

export async function gitRoot(cwd = process.cwd()) {
  try {
    // Redirect standard error to null to suppress Git error messages
    const raw = await shell('git', ['rev-parse', '--show-toplevel'], {
      cwd,
      stderr: 'ignore'
    });
    return raw.stdout.trim();
  } catch {
    return null;
  }
}

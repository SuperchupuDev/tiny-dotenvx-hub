import { shell } from '../../shared/shell.js';

const env = {
  ...process.env,
  LC_CTYPE: 'UTF-8'
};

export function copy(options) {
  return shell('pbcopy', { ...options, env });
}
export async function paste(options) {
  const { stdout } = await shell('pbpaste', { ...options, env });
  return stdout;
}

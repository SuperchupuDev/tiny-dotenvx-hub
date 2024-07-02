import { spawn } from 'node:child_process';

export function open(url) {
  const startCommand = {
    darwin: 'open',
    win32: 'start',
    linux: './xdg-open'
  }[process.platform];
  if (!startCommand) {
    return;
  }

  return spawn(startCommand, [url], { stdio: 'ignore', shell: true }).unref();
}

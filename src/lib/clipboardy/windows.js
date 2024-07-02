import { arch } from 'node:os';
import { join } from 'node:path';
import { shell } from '../../shared/shell.js';

// Binaries from: https://github.com/sindresorhus/clipboardy/tree/v2.3.0
const windowBinaryPath =
  arch() === 'x64'
    ? join(import.meta.dirname, './fallbacks/windows/clipboard_x86_64.exe')
    : join(import.meta.dirname, './fallbacks/windows/clipboard_i686.exe');

export async function copy(options) {
  return await shell(windowBinaryPath, ['--copy'], options);
}

export async function paste(options) {
  const { stdout } = await shell(windowBinaryPath, ['--paste'], options);
  return stdout;
}

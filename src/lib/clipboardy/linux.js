import { join } from 'node:path';
import { shell } from '../../shared/shell.js';

const xsel = 'xsel';
const xselFallback = join(import.meta.dirname, './fallbacks/linux/xsel');

const copyArguments = ['--clipboard', '--input'];
const pasteArguments = ['--clipboard', '--output'];

const makeError = (xselError, fallbackError) => {
  let error;
  if (xselError.code === 'ENOENT') {
    error = new Error(
      "Couldn't find the `xsel` binary and fallback didn't work. On Debian/Ubuntu you can install xsel with: sudo apt install xsel"
    );
  } else {
    error = new Error('Both xsel and fallback failed');
    error.xselError = xselError;
  }

  error.fallbackError = fallbackError;
  return error;
};

const xselWithFallback = async (argumentList, options) => {
  try {
    const { stdout } = await shell(xsel, argumentList, options);
    return stdout;
  } catch (xselError) {
    try {
      const { stdout } = await shell(xselFallback, argumentList, options);
      return stdout;
    } catch (fallbackError) {
      throw makeError(xselError, fallbackError);
    }
  }
};

export async function copy(options) {
  await xselWithFallback(copyArguments, options);
}

export function paste(options) {
  return xselWithFallback(pasteArguments, options);
}

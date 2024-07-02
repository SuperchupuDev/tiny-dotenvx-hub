// based on "clipboardy" by Sindre Sorhus (https://github.com/sindresorhus/clipboardy)
// licensed under the MIT License (see [license](https://github.com/sindresorhus/clipboardy/blob/v2.3.0/license) file for details).

import isWSL from 'is-wsl';
import * as linux from './clipboardy/linux.js';
import * as macos from './clipboardy/macos.js';
import * as termux from './clipboardy/termux.js';
import * as windows from './clipboardy/windows.js';

const platformLib = (() => {
  switch (process.platform) {
    case 'darwin':
      return macos;
    case 'win32':
      return windows;
    case 'android':
      if (process.env.PREFIX !== '/data/data/com.termux/files/usr') {
        throw new Error('You need to install Termux for this module to work on Android: https://termux.com');
      }

      return termux;
    default:
      // `process.platform === 'linux'` for WSL.
      if (isWSL) {
        return windows;
      }

      return linux;
  }
})();

export async function write(text) {
  if (typeof text !== 'string') {
    throw new TypeError(`Expected a string, got ${typeof text}`);
  }

  await platformLib.copy({ input: text });
}

export function read() {
  return platformLib.paste({ stripEof: false });
}

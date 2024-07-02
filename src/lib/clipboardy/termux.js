import { shell } from '../../shared/shell.js';

const handler = error => {
  if (error.code === 'ENOENT') {
    throw new Error("Couldn't find the termux-api scripts. You can install them with: apt install termux-api");
  }

  throw error;
};

export async function copy(options) {
  try {
    await shell('termux-clipboard-set', options);
  } catch (error) {
    handler(error);
  }
}

export async function paste(options) {
  try {
    const { stdout } = await shell('termux-clipboard-get', options);
    return stdout;
  } catch (error) {
    handler(error);
  }
}

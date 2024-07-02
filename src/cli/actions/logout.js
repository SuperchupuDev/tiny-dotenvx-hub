import { setTimeout as sleep } from 'node:timers/promises';

import { open } from '../../lib/open/index.js';
import confirm from './../../shared/confirm.js';
import { createSpinner } from './../../shared/createSpinner.js';
import { logger } from './../../shared/logger.js';
import * as store from './../../shared/store.js';

const username = store.getUsername();
const usernamePart = username ? ` [${username}]` : '';
const spinner = createSpinner(`logging off machine${usernamePart}`);

export async function logout() {
  spinner.start();
  await sleep(500); // better dx

  // debug opts
  const options = this.opts();
  logger.debug(`options: ${JSON.stringify(options)}`);

  logger.debug('deleting settings.DOTENVX_TOKEN');
  store.deleteToken();

  logger.debug('deleting settings.DOTENVX_HOSTNAME');
  store.deleteHostname();

  spinner.done(`logged off machine${usernamePart}`);

  const hostname = options.hostname;
  const logoutUrl = `${hostname}/logout`;

  // optionally allow user to open browser
  const answer = await confirm({ message: `press Enter to also log off browser [${logoutUrl}]...` });

  if (answer) {
    spinner.start();
    await sleep(500); // better dx
    open(logoutUrl);
    spinner.done(`logged off browser${usernamePart}`);
  }
}

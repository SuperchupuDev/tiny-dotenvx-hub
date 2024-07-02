import { logger } from './../../shared/logger.js';
import { getHostname, getUsername } from './../../shared/store.js';

export function status() {
  const username = getUsername();
  if (!username) {
    logger.info('not logged in');
    return;
  }
  logger.info(`logged in to ${getHostname()} as ${getUsername()}`);
}

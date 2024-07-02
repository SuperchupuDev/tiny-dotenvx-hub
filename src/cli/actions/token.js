import { logger } from './../../shared/logger.js';
import { configPath, getToken } from './../../shared/store.js';

export function token() {
  logger.debug(configPath());
  logger.info(getToken());
}

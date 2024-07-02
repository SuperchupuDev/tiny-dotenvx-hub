import { inspect, styleText } from 'node:util';

const error = (...args) => args.map(m => styleText(['red', 'bold'], m));
const warn = (...args) => args.map(m => styleText('yellow', m));
const help = (...args) => args.map(m => styleText('blue', m));
const help2 = (...args) => args.map(m => styleText('gray', m));
const http = (...args) => args.map(m => styleText('green', m));
const debug = (...args) => args.map(m => styleText('magenta', m));

export const logger = {
  level: 'info',
  error: message => console.error(...error(message)),
  warn: message => console.warn(...warn(message)),
  info: message => console.info(message),
  help: message => console.log(...help(message)),
  help2: message => console.log(...help2(message)),
  http: message => {
    if (logger.level === 'verbose' || logger.level === 'debug') {
      console.log(...http(typeof message === 'object' ? inspect(message) : message));
    }
  },
  debug: message => {
    if (logger.level === 'debug') {
      console.log(...debug(typeof message === 'object' ? inspect(message) : message));
    }
  }
};

export const setLogLevel = options => {
  let logLevel;
  switch (true) {
    case options.debug:
      logLevel = 'debug';
      break;
    case options.verbose:
      logLevel = 'verbose';
      break;
    case options.quiet:
      logLevel = 'error';
      break;
    default:
      logLevel = options.logLevel;
  }

  if (!logLevel) {
    return;
  }

  logger.level = logLevel;
  // Only log which level it's setting if it's not set to quiet mode
  if (!options.quiet || (options.quiet && logLevel !== 'error')) {
    logger.debug(`Setting log level to ${logLevel}`);
  }
};

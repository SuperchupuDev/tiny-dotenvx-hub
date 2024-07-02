#!/usr/bin/env node

import { Command } from 'commander';

import { packageJson } from '../lib/packageJson.js';
import { setLogLevel } from '../shared/logger.js';
import * as store from '../shared/store.js';

import { login } from './actions/login.js';
import { logout } from './actions/logout.js';
import { open } from './actions/open.js';
import { pull } from './actions/pull.js';
import { push } from './actions/push.js';
import { status } from './actions/status.js';
import { token } from './actions/token.js';

const program = new Command();

// global log levels
program
  .option('-l, --log-level <level>', 'set log level', 'info')
  .option('-q, --quiet', 'sets log level to error')
  .option('-v, --verbose', 'sets log level to verbose')
  .option('-d, --debug', 'sets log level to debug')
  .hook('preAction', thisCommand => {
    const options = thisCommand.opts();

    setLogLevel(options);
  });

// cli
program.name('env-hub').description(packageJson.description).version(packageJson.version);

program
  .command('login')
  .description('authenticate to dotenvx hub')
  .option('-h, --hostname <url>', 'set hostname', store.getHostname())
  .action(login);

program
  .command('push')
  .description('push .env.keys to dotenvx hub')
  .argument('[directory]', 'directory to push', '.')
  .option('-h, --hostname <url>', 'set hostname', store.getHostname())
  .action(push);

program
  .command('pull')
  .description('pull .env.keys from dotenvx hub')
  .argument('[directory]', 'directory to pull', '.')
  .option('-h, --hostname <url>', 'set hostname', store.getHostname())
  .action(pull);

program
  .command('open')
  .description('view repository on dotenvx hub')
  .option('-h, --hostname <url>', 'set hostname', store.getHostname())
  .action(open);

program
  .command('token')
  .description('print the auth token dotenvx hub is configured to use')
  .option('-h, --hostname <url>', 'set hostname', 'https://hub.dotenvx.com')
  .action(token);

program.command('status').description('display logged in user').action(status);

program
  .command('logout')
  .description('log out this machine from dotenvx hub')
  .option('-h, --hostname <url>', 'set hostname', store.getHostname())
  .action(logout);

program.parse(process.argv);

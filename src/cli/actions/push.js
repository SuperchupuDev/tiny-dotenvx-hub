import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { request } from 'undici';

import { createSpinner } from './../../shared/createSpinner.js';
import { logger } from './../../shared/logger.js';
import * as store from './../../shared/store.js';

import { extractUsernameName } from '../../lib/extractUsernameName.js';
import { forgivingDirectory } from '../../lib/forgivingDirectory.js';
import { gitRoot } from '../../lib/gitRoot.js';
import { gitUrl } from '../../lib/gitUrl.js';
import { isGitRepo } from '../../lib/isGitRepo.js';
import isGithub from '../../lib/isGithub.js';

const spinner = createSpinner('pushing');

// constants
const ENCODING = 'utf8';

// Create a simple-git instance for the current directory
export async function push(_directory) {
  spinner.start();
  await sleep(500); // better dx

  const directory = forgivingDirectory(_directory);

  // debug args
  logger.debug(`directory: ${directory}`);

  // debug opts
  const options = this.opts();
  logger.debug(`options: ${JSON.stringify(options)}`);

  // must be a git repo
  const isRepo = await isGitRepo();
  if (!isRepo) {
    spinner.fail('oops, must be a git repository');
    logger.help('? create one with [git init .]');
    process.exit(1);
  }
  // must be a git root
  const gitroot = await gitRoot();
  if (!gitroot) {
    spinner.fail("oops, could not determine git repository's root");
    logger.help('? create one with [git init .]');
    process.exit(1);
  }
  // must have a remote origin url
  const giturl = await gitUrl();
  if (!giturl) {
    spinner.fail('oops, must have a remote origin (git remote -v)');
    logger.help(
      '? create it at [github.com/new] and then run [git remote add origin git@github.com:username/repository.git]'
    );
    process.exit(1);
  }
  // must be a github remote
  if (!isGithub(giturl)) {
    spinner.fail('oops, must be a github.com remote origin (git remote -v)');
    logger.help(
      '? create it at [github.com/new] and then run [git remote add origin git@github.com:username/repository.git]'
    );
    logger.help2('ℹ need support for other origins? [please tell us](https://github.com/dotenvx/dotenvx/issues)');
    process.exit(1);
  }

  const envKeysFilepath = path.join(directory, '.env.keys');
  if (!fs.existsSync(envKeysFilepath)) {
    spinner.fail('oops, missing .env.keys file');
    logger.help(`? generate one with [dotenvx encrypt${directory ? ` ${directory}` : ''}]`);
    logger.help2('ℹ a .env.keys file holds decryption keys for a .env.vault file');
    process.exit(1);
  }

  const hostname = options.hostname;
  const pushUrl = `${hostname}/v1/push`;
  const oauthToken = store.getToken();
  const dotenvKeysContent = fs.readFileSync(envKeysFilepath, ENCODING);
  const usernameName = extractUsernameName(giturl);
  const relativeEnvKeysFilepath = path
    .relative(gitroot, path.join(process.cwd(), directory, '.env.keys'))
    .replace(/\\/g, '/'); // smartly determine path/to/.env.keys file from repository root - where user is cd-ed inside a folder or at repo root

  try {
    const response = await request(pushUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username_name: usernameName,
        DOTENV_KEYS: dotenvKeysContent,
        filepath: relativeEnvKeysFilepath
      })
    });

    const responseData = await response.body.json();

    if (response.statusCode >= 400) {
      logger.http(responseData);
      spinner.fail(responseData.error.message);
      if (response.statusCode === 404) {
        logger.help(`? try visiting [${hostname}/gh/${usernameName}] in your browser`);
      }
      process.exit(1);
    }
  } catch (error) {
    spinner.fail(error.toString());
    process.exit(1);
  }

  spinner.succeed(`pushed [${usernameName}]`);
  logger.help2('ℹ run [env-hub open] to view on hub');
}

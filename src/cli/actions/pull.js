import fs from 'node:fs';
import path from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

import { createSpinner } from './../../shared/createSpinner.js';
import { logger } from './../../shared/logger.js';
import * as store from './../../shared/store.js';

import { extractUsernameName } from '../../lib/extractUsernameName.js';
import { gitRoot } from '../../lib/gitRoot.js';
import { gitUrl } from '../../lib/gitUrl.js';
import { isGitRepo } from '../../lib/isGitRepo.js';
import isGithub from '../../lib/isGithub.js';

const spinner = createSpinner('pulling');

// constants
const ENCODING = 'utf8';

// Create a simple-git instance for the current directory
export async function pull(directory) {
  spinner.start();
  await sleep(500); // better dx

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
  const hostname = options.hostname;
  const pullUrl = `${hostname}/v1/pull`;
  const oauthToken = store.getToken();
  const usernameName = extractUsernameName(giturl);
  const relativeEnvKeysFilepath = path
    .relative(gitroot, path.join(process.cwd(), directory, '.env.keys'))
    .replace(/\\/g, '/'); // smartly determine path/to/.env.keys file from repository root - where user is cd-ed inside a folder or at repo root

  try {
    const response = await fetch(pullUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${oauthToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username_name: usernameName,
        filepath: relativeEnvKeysFilepath
      })
    });

    const responseData = await response.json();

    if (response.statusCode >= 400) {
      logger.http(responseData);
      spinner.fail(responseData.error.message);
      if (response.statusCode === 404) {
        logger.help(`? try visiting [${hostname}/gh/${usernameName}] in your browser`);
      }
      process.exit(1);
    }

    if (fs.existsSync(envKeysFilepath) && fs.readFileSync(envKeysFilepath, ENCODING) === responseData.DOTENV_KEYS) {
      spinner.done(`no changes (${envKeysFilepath})`);
    } else {
      fs.writeFileSync(envKeysFilepath, responseData.DOTENV_KEYS);
      spinner.succeed(`pulled [${usernameName}]`);
      logger.help2(`ℹ run [cat ${envKeysFilepath}] to view locally`);
    }
  } catch (error) {
    spinner.fail(error.toString());
    process.exit(1);
  }
}

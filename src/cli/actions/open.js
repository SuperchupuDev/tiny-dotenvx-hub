import { setTimeout as sleep } from 'node:timers/promises';

import confirm from './../../shared/confirm.js';
import { createSpinner } from './../../shared/createSpinner.js';
import { logger } from './../../shared/logger.js';

import { extractUsernameName } from '../../lib/extractUsernameName.js';
import { gitRoot } from '../../lib/gitRoot.js';
import { gitUrl } from '../../lib/gitUrl.js';
import { isGitRepo } from '../../lib/isGitRepo.js';
import isGithub from '../../lib/isGithub.js';
import { open as openBrowser } from '../../lib/open/index.js';

const spinner = createSpinner('opening');

export async function open() {
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

  const usernameName = extractUsernameName(giturl);
  const openUrl = `${options.hostname}/gh/${usernameName}`;

  // optionally allow user to open browser
  const answer = await confirm({ message: `press Enter to open [${openUrl}]...` });

  if (answer) {
    spinner.start();
    await sleep(500); // better dx
    openBrowser(openUrl);
    spinner.succeed(`opened [${usernameName}]`);
  }
}

import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { isGitRepo } from '../../src/lib/isGitRepo.js';

test('#isGitRepo', async () => {
  const result = await isGitRepo();

  assert.equal(result, true);
});

test('should return false when not in a git repository', async () => {
  const cwd = path.join(import.meta.dirname, '../../..');
  assert.equal(await isGitRepo(cwd), false);
});

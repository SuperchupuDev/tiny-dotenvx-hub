import assert from 'node:assert/strict';
import { join } from 'node:path';
import { test } from 'node:test';

import { gitUrl } from '../../src/lib/gitUrl.js';

test('#gitUrl', async () => {
  const result = await gitUrl();

  assert.equal(result.includes('https://github.com'), true);
});

test('should return null when not in a git repository', async () => {
  const cwd = join(import.meta.dirname, '../../..');
  const result = await gitUrl(cwd);

  assert.equal(result, null);
});

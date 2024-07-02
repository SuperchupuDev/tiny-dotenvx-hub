import assert from 'node:assert/strict';
import path from 'node:path';
import { test } from 'node:test';

import { gitRoot } from '../../src/lib/gitRoot.js';

test('#gitRoot', async () => {
  const expectedPath = path.resolve(import.meta.dirname, '../..').replace(/\\/g, '/');

  const result = await gitRoot();

  assert.equal(result, expectedPath);
});

test('should return null when not in a git repository', async () => {
  const cwd = path.join(import.meta.dirname, '../../..');
  const result = await gitRoot(cwd);

  assert.equal(result, null);
});

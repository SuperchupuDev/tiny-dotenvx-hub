import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { test } from 'node:test';

import { gitUrl } from '../../src/lib/gitUrl.js';

test('#gitUrl', async () => {
  const expectedPath = resolve(import.meta.dirname, '../../src/lib/gitUrl').replace(/\\/g, '/');

  const result = await gitUrl();

  assert.equal(result, expectedPath);
});

test('should return null when not in a git repository', async () => {
  const result = await gitUrl();

  assert.equal(result, null);
});

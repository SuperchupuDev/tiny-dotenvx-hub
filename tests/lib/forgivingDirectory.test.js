import { test } from 'node:test';
import assert from 'node:assert/strict';

import { forgivingDirectory } from '../../src/lib/forgivingDirectory.js';

test('#forgivingDirectory as .env.keys file', () => {
  const directory = forgivingDirectory('backend/.env.keys');

  assert.equal(directory, 'backend');
});

test('#forgivingDirectory directory', () => {
  const directory = forgivingDirectory('backend/');

  assert.equal(directory, 'backend/');
});

test('#forgivingDirectory directory without backslash', () => {
  const directory = forgivingDirectory('backend');

  assert.equal(directory, 'backend');
});

test('#forgivingDirectory root .env.keys', () => {
  const directory = forgivingDirectory('.env.keys');

  assert.equal(directory, '.');
});

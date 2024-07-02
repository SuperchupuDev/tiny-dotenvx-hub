import assert from 'node:assert/strict';
import { test } from 'node:test';

import { extractUsernameName } from '../../src/lib/extractUsernameName.js';

test('#extractUsernameName', () => {
  const result = extractUsernameName('https://github.com/motdotla/dotenv');

  assert.equal(result, 'motdotla/dotenv');
});

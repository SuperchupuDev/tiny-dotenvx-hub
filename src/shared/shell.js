// This is an extremely simplified version of [`execa`](https://github.com/sindresorhus/execa)
// intended to keep the dependency size down

// Based on astro's implementation
// https://github.com/withastro/astro/blob/main/packages/create-astro/src/shell.ts

/* node:coverage disable */

import { spawn } from 'node:child_process';
import { text as textFromStream } from 'node:stream/consumers';

const text = stream => (stream ? textFromStream(stream).then(t => t.trimEnd()) : '');

export async function shell(command, flags, opts = {}) {
  let child;
  let stdout = '';
  let stderr = '';
  try {
    child = spawn(command, flags, {
      cwd: opts.cwd,
      shell: true,
      stdio: opts.stdio,
      timeout: opts.timeout
    });
    if (opts.input) {
      child.stdin.write(opts.input);
      child.stdin.end();
    }
    const done = new Promise(resolve => child.on('close', resolve));
    [stdout, stderr] = await Promise.all([text(child.stdout), text(child.stderr)]);
    await done;
  } catch {
    throw { stdout, stderr, exitCode: 1 };
  }
  const { exitCode } = child;
  if (exitCode === null) {
    throw new Error('Timeout');
  }
  if (exitCode !== 0) {
    throw new Error(stderr);
  }
  return { stdout, stderr, exitCode };
}

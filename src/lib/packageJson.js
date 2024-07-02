import fs from 'node:fs';
import path from 'node:path';

const packageJsonPath = path.join(import.meta.dirname, '../../package.json');

export const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

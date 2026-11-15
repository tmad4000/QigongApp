import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { appInfo } from './build-info.mjs';
const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
const info = appInfo(pkg.version);
execFileSync('npx', ['expo', 'export', '--platform', 'web'], { stdio: 'inherit', env: { ...process.env, APP_BUILD_INFO: JSON.stringify(info) } });
writeFileSync(new URL('../dist/version.json', import.meta.url), JSON.stringify(info) + '\n');

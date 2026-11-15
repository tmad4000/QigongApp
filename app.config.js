const { execFileSync } = require('node:child_process');
const pkg = require('./package.json');
module.exports = ({ config }) => {
  let release;
  if (process.env.APP_BUILD_INFO) release = JSON.parse(process.env.APP_BUILD_INFO);
  else {
    release = { version: pkg.version, commit: '', commitTime: '', buildTime: new Date().toISOString(), event: 'build' };
    try {
      release.commit = execFileSync('git', ['rev-parse', '--short=7', 'HEAD'], { encoding: 'utf8' }).trim();
      release.commitTime = execFileSync('git', ['log', '-1', '--format=%cI', 'HEAD'], { encoding: 'utf8' }).trim();
      const dirty = execFileSync('git', ['status', '--porcelain', '--untracked-files=no'], { encoding: 'utf8' }).trim();
      release.event = dirty ? 'build' : 'commit';
      if (dirty) release.commit += '-dirty';
    } catch { /* A source archive uses its recorded build time. */ }
  }
  return { ...config, version: pkg.version, extra: { ...config.extra, release } };
};

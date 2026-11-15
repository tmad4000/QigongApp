import React, { useEffect, useState } from 'react';
import pkg from '../package.json';
import { format } from './app-stamp';
export default function ReleaseStamp({ color }: { color: string }) {
  const info = JSON.parse(process.env.EXPO_PUBLIC_APP_BUILD_INFO || '{}');
  const version = info.version || pkg.version;
  const [now, setNow] = useState(Date.now());
  const [exact, setExact] = useState(false);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    const refresh = () => { clearInterval(timer); if (!document.hidden) { setNow(Date.now()); timer = setInterval(() => setNow(Date.now()), 60000); } };
    refresh(); document.addEventListener('visibilitychange', refresh);
    return () => { clearInterval(timer); document.removeEventListener('visibilitychange', refresh); };
  }, []);
  const build = info.event === 'build' || !info.commitTime;
  const time = format(build ? info.buildTime : info.commitTime, now);
  const detail = time ? time.detail + (info.commit ? ' · commit ' + info.commit.slice(0, 7) : '') + (build ? ' (build time)' : '') : '';
  return <button type="button" onClick={() => setExact(!exact)} title={detail} aria-label={detail ? `v${version}, updated ${detail}` : `v${version}`}
    style={{ border: 0, background: 'none', color, padding: 4, cursor: 'pointer', font: '12px system-ui, sans-serif', fontVariantNumeric: 'tabular-nums', whiteSpace: exact ? 'normal' : 'nowrap' }}>
    {version && `v${version}`}{version && time && ' · '}{time && <time dateTime={time.datetime} title={detail}>{exact ? detail : 'Updated ' + time.label}</time>}
  </button>;
}

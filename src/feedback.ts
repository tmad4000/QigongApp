// Web feedback opens from About; no launcher floats over the practice screen.
export function openWebFeedback() {
  const w = window as Window & { WitFeedback?: { open(): void }; __witFeedbackQueue?: [string, unknown[]][] };
  if (!document.querySelector('script[src*="worldissuetracker.com/widget/wit-feedback.js"]')) {
    const loader = document.createElement('script');
    loader.src = 'https://worldissuetracker.com/widget/wit-feedback.js';
    Object.assign(loader.dataset, { trackerSlug: 'qigongapp-feedback', app: 'QigongApp', trigger: 'none', mode: 'feedback' });
    document.body.appendChild(loader);
  }
  if (w.WitFeedback) w.WitFeedback.open();
  else (w.__witFeedbackQueue ||= []).push(['open', []]);
}

export type Theme = 'light' | 'dark';

const root = document.documentElement;

export function currentTheme(): Theme {
  const set = root.getAttribute('data-theme');
  if (set === 'light' || set === 'dark') return set;
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

/** Apply a theme and remember it (the inline script in <head> restores it on load). */
export function setTheme(theme: Theme) {
  root.setAttribute('data-theme', theme);
  try {
    localStorage.setItem('nl-theme', theme);
  } catch {}
}

export function toggleTheme(): Theme {
  const next = currentTheme() === 'light' ? 'dark' : 'light';
  setTheme(next);
  return next;
}

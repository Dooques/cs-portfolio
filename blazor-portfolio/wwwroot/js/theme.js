// Light/dark theme toggle, persisted to localStorage.
// The anti-FOUC bootstrap (setting data-theme before first paint) lives
// inline in Components/App.razor's <head> — this file only handles the
// toggle button's runtime behavior.

const STORAGE_KEY = 'theme';

export function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
}

export function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

// Light/dark theme toggle, persisted to localStorage.
// The anti-FOUC bootstrap (setting data-theme before first paint) lives
// inline in Components/App.razor's <head> — this file only handles the
// toggle button's runtime behavior.
//
// ThemeToggle.razor is mounted twice (BioHeader and SectionNav), each as
// its own independent Blazor component instance with its own local
// IsDark field. Without the listener registry below, toggling one never
// tells the other — each only ever reads the theme once, on its own
// first render. Every mounted instance registers itself here and gets
// called back whenever *either* one changes the theme.

const STORAGE_KEY = 'theme';
const listeners = new Set();

export function getTheme() {
    return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
}

export function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    notifyListeners(theme);
}

export function toggleTheme() {
    const next = getTheme() === 'dark' ? 'light' : 'dark';
    setTheme(next);
    return next;
}

export function onThemeChange(dotNetRef) {
    listeners.add(dotNetRef);
}

export function offThemeChange(dotNetRef) {
    listeners.delete(dotNetRef);
}

function notifyListeners(theme) {
    for (const ref of listeners) {
        ref.invokeMethodAsync('OnThemeChanged', theme).catch(() => {
            // Circuit gone or ref already disposed — stop calling it.
            listeners.delete(ref);
        });
    }
}

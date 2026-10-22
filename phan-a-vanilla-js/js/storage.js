const FAV_KEY = 'library_favorites';
const THEME_KEY = 'library_theme';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY)) || [];
  } catch {
    return [];
  }
}

export function saveFavorites(favIds) {
  localStorage.setItem(FAV_KEY, JSON.stringify(favIds));
}

export function getTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}
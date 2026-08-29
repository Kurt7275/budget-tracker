export const THEMES = [
  { id: 'comic', label: 'COMIC' },
  { id: 'anime', label: 'ANIME' },
  { id: 'fantasy', label: 'FANTASY' },
  { id: 'cyberpunk', label: 'CYBERPUNK' },
  { id: 'horror', label: 'HORROR' },
  { id: 'nature', label: 'NATURE' }
]

export function getStoredTheme() {
  return localStorage.getItem('comicverse_theme') || 'comic'
}

export function applyThemeToDocument(themeId) {
  const theme = THEMES.some(item => item.id === themeId) ? themeId : 'comic'
  document.documentElement.classList.remove(...THEMES.map(item => `theme-${item.id}`))
  document.documentElement.classList.add(`theme-${theme}`)
  localStorage.setItem('comicverse_theme', theme)
  return theme
}

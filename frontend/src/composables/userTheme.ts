import { ref, watchEffect } from 'vue'

// Reactive theme state (shared across components)
const currentTheme = ref<'light' | 'dark'>('light')

export function useTheme() {
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

    const theme = savedTheme || (prefersDark ? 'dark' : 'light')
    applyTheme(theme)
  }

  const applyTheme = (theme: 'light' | 'dark') => {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  const setTheme = (theme: 'light' | 'dark') => {
    applyTheme(theme)
  }

  const watchSystemTheme = () => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  initTheme()
  watchSystemTheme()

  return {
    currentTheme,
    toggleTheme,
    setTheme
  }
}
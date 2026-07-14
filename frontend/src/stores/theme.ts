import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const currentTheme = ref<'light' | 'dark'>('light') // Default to light

  function getInitialTheme(): 'light' | 'dark' {
    //Check localStorage first
    const saved = localStorage.getItem('theme')
    if (saved === 'light' || saved === 'dark') {
      return saved
    }
    
    //Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    
    //Default to light
    return 'light'
  }

  function applyTheme(theme: 'light' | 'dark') {
    currentTheme.value = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
    console.log('Theme applied:', theme) // Debug log
  }

  function init() {
    const theme = getInitialTheme()
    applyTheme(theme)
  }

  function toggle() {
    const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
    applyTheme(newTheme)
  }

  function setTheme(theme: 'light' | 'dark') {
    applyTheme(theme)
  }

  // Listen for system theme changes
  function watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Only apply system preference if user hasn't manually set a theme
      if (!localStorage.getItem('theme')) {
        applyTheme(e.matches ? 'dark' : 'light')
      }
    })
  }

  return { 
    currentTheme, 
    init, 
    toggle, 
    setTheme,
    watchSystemTheme 
  }
})
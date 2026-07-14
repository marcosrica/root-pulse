import './assets/base.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useI18n } from './locales/i18n.ts'
import { useThemeStore } from './stores/theme'

async function initApp() {
    const app = createApp(App)
    const pinia = createPinia()
    
    app.use(pinia)
    app.use(router)
    
    const themeStore = useThemeStore()
    themeStore.init()
    themeStore.watchSystemTheme()
  
    const { initI18n } = useI18n()
    await initI18n()
    
    app.mount('#app')
}

initApp()
import { ref } from 'vue'

// Parse multi-language CSV
function parseMultiLangCSV(csvText: string): {
  locales: string[]
  messages: Record<string, Record<string, string>>
} {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) {
    throw new Error('CSV file is empty or missing headers')
  }
  
  // Parse header to get locale codes
  const headers = parseCSVLine(lines[0])
  const locales = headers.slice(1)
  
  // Initialize messages object
  const messages: Record<string, Record<string, string>> = {}
  locales.forEach(locale => {
    messages[locale] = {}
  })
  
  // Parse each translation row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    
    const values = parseCSVLine(line)
    const key = values[0]
    
    // Add translation for each locale
    locales.forEach((locale, index) => {
      if (values[index + 1]) {
        messages[locale][key] = values[index + 1]
      }
    })
  }
  
  return { locales, messages }
}

// Parse a CSV line handling quoted values
function parseCSVLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    
    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  
  result.push(current.trim())
  return result
}

// Interpolate variables
function interpolate(text: string, params?: Record<string, string | number>): string {
  if (!params) return text
  return text.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

// ─── Singleton i18n instance ───
const currentLocale = ref('en')
const messages = ref<Record<string, Record<string, string>>>({})
const availableLocales = ref<string[]>([])
const isLoaded = ref(false)

// Load the CSV file
async function loadTranslations() {
  try {
    // Use ?raw to get the raw CSV text
    const csvModule = await import('../locales/translations.csv?raw')
    const { locales, messages: parsedMessages } = parseMultiLangCSV(csvModule.default)
    
    availableLocales.value = locales
    messages.value = parsedMessages
    isLoaded.value = true
    
    // Set initial locale
    const savedLocale = localStorage.getItem('locale')
    if (savedLocale && locales.includes(savedLocale)) {
      currentLocale.value = savedLocale
    } else {
      currentLocale.value = locales[0] || 'en'
    }
    
    console.log('Translations loaded! Locales:', locales)
    console.log('Current locale:', currentLocale.value)
    console.log('Available keys:', Object.keys(messages.value[currentLocale.value] || {}))
  } catch (error) {
    console.error('Failed to load translations:', error)
  }
}

// Set locale
function setLocale(locale: string) {
  if (availableLocales.value.includes(locale)) {
    currentLocale.value = locale
    localStorage.setItem('locale', locale)
    console.log('🌐 Locale changed to:', locale)
  } else {
    console.warn(`Locale "${locale}" not available. Available:`, availableLocales.value)
  }
}

// Translate function
function t(key: string, params?: Record<string, string | number>): string {
  if (!isLoaded.value) {
    console.warn('Translations not loaded yet')
    return key
  }
  
  const localeMessages = messages.value[currentLocale.value]
  if (!localeMessages) {
    console.warn(`No messages for locale: ${currentLocale.value}`)
    return key
  }
  
  const translation = localeMessages[key]
  if (!translation) {
    console.warn(`Missing translation: "${key}" for locale: ${currentLocale.value}`)
    console.log('Available keys:', Object.keys(localeMessages))
    return key
  }
  
  return interpolate(translation, params)
}

// Initialize (call once in main.ts)
async function initI18n() {
  await loadTranslations()
}

// Export the composable
export function useI18n() {
  return {
    currentLocale,
    setLocale,
    t,
    isLoaded,
    availableLocales,
    initI18n
  }
}
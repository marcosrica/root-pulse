<script setup lang="ts">
import { ref, computed, useId } from 'vue'
import { Eye, EyeOff, X, AlertCircle, CheckCircle } from 'lucide-vue-next'

// Props
const props = withDefaults(defineProps<{
  modelValue?: string | number
  label?: string
  type?: 'text' | 'password' | 'email' | 'number' | 'search' | 'url' | 'tel'
  placeholder?: string
  error?: string
  helperText?: string
  success?: boolean
  disabled?: boolean
  required?: boolean
  clearable?: boolean
  showPasswordToggle?: boolean
  maxlength?: number
  autocomplete?: string
  leftIcon?: any
  rightIcon?: any
  changed?: () => void
}>(), {
  type: 'text',
  placeholder: '',
  autocomplete: 'off',
  showPasswordToggle: true
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'focus': [event: FocusEvent]
  'blur': [event: FocusEvent]
  'clear': []
}>()

// State
const inputId = useId()
const inputRef = ref<HTMLInputElement>()
const isFocused = ref(false)
const showPassword = ref(false)

// Computed
const hasIcon = computed(() => {
  return !!(props.leftIcon || props.rightIcon || props.showPasswordToggle)
})

// Methods
const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const handleBlur = (event: FocusEvent) => {
  isFocused.value = false
  emit('blur', event)
}

const clearInput = () => {
  emit('update:modelValue', '')
  emit('clear')
  inputRef.value?.focus()
}

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
  inputRef.value?.focus()
}
</script>

<template>
  <div class="input-wrapper">
    <!-- Label -->
    <label 
      v-if="label" 
      :for="inputId" 
      class="input-label"
    >
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>

    <!-- Input Container -->
    <div 
      class="input-container"
      :class="{
        'input-focused': isFocused,
        'input-error': error,
        'input-disabled': disabled,
        'input-with-icon': hasIcon
      }"
    >
      <!-- Left Icon -->
      <div v-if="$slots.leftIcon || leftIcon" class="icon-left">
        <slot name="leftIcon">
          <component :is="leftIcon" v-if="leftIcon" class="icon" />
        </slot>
      </div>

      <!-- Actual Input -->
      <input
        :id="inputId"
        ref="inputRef"
        :type="showPassword ? 'text' : type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :maxlength="maxlength"
        :autocomplete="autocomplete"
        v-on:change="changed"
        class="input-field"
        :class="{
          'has-left-icon': $slots.leftIcon || leftIcon,
          'has-right-icon': $slots.rightIcon || rightIcon || showPasswordToggle || (clearable && modelValue)
        }"
        @input="handleInput"
        @focus="isFocused = true"
        @blur="handleBlur"
      />

      <!-- Password Toggle -->
      <button 
        v-if="type === 'password' && showPasswordToggle"
        type="button"
        class="icon-right password-toggle"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <Eye v-if="!showPassword" class="icon" />
        <EyeOff v-else class="icon" />
      </button>

      <!-- Right Icon -->
      <div v-if="$slots.rightIcon || rightIcon" class="icon-right">
        <slot name="rightIcon">
          <component :is="rightIcon" v-if="rightIcon" class="icon" />
        </slot>
      </div>

      <!-- Clear Button -->
      <button 
        v-if="clearable && modelValue" 
        type="button"
        class="icon-right clear-button"
        @click="clearInput"
        aria-label="Clear input"
      >
        <X class="icon" />
      </button>
    </div>

    <!-- Helper Text / Error Message -->
    <div v-if="helperText || error" class="input-message">
      <AlertCircle v-if="error" class="message-icon error-icon" />
      <CheckCircle v-else-if="success" class="message-icon success-icon" />
      <span :class="{ 'text-error': error, 'text-success': success }">
        {{ error || helperText }}
      </span>
    </div>

    <!-- Character Count -->
    <div v-if="maxlength" class="char-count">
      {{ String(modelValue || '').length }}/{{ maxlength }}
    </div>
  </div>
</template>

<style scoped>
/* ─── Wrapper ─── */
.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

/* ─── Label ─── */
.input-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--main-text-color);
  transition: var(--transition-theme);
}

.required-star {
  color: #FF6B6B;
  margin-left: 2px;
}

/* ─── Input Container (Glass Effect) ─── */
.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--div-border);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
  overflow: hidden;
}

/* Dark mode adjustments */
[data-theme="dark"] .input-container {
  background: rgba(255, 255, 255, 0.05);
}

/* Focus State */
.input-focused {
  border-color: var(--btn-primary-bg, #2D8A4E);
  box-shadow: 
    0 0 0 3px rgba(45, 138, 78, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.15);
}

/* Error State */
.input-error {
  border-color: #FF6B6B;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

/* Disabled State */
.input-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

/* ─── Input Field ─── */
.input-field {
  flex: 1;
  width: 100%;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  outline: none;
  font-size: 0.9375rem;
  color: var(--main-text-color);
  transition: var(--transition-theme);
}

.input-field::placeholder {
  color: var(--main-text-color);
  opacity: 0.5;
}

.input-field:disabled {
  cursor: not-allowed;
}

/* Padding adjustments for icons */
.has-left-icon {
  padding-left: 0.5rem;
}

.has-right-icon {
  padding-right: 0.5rem;
}

/* ─── Icons ─── */
.icon-left,
.icon-right {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 0.75rem;
  color: var(--main-text-color);
  opacity: 0.6;
}

.icon {
  width: 1.125rem;
  height: 1.125rem;
}

/* Password Toggle & Clear Button */
.password-toggle,
.clear-button {
  background: none;
  border: none;
  padding: 0.5rem;
  cursor: pointer;
  color: var(--main-text-color);
  opacity: 0.6;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.password-toggle:hover,
.clear-button:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

/* ─── Messages ─── */
.input-message {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.8125rem;
  min-height: 1.25rem;
}

.message-icon {
  width: 0.875rem;
  height: 0.875rem;
  flex-shrink: 0;
}

.error-icon {
  color: #FF6B6B;
}

.success-icon {
  color: #6BCB77;
}

.text-error {
  color: #FF6B6B;
}

.text-success {
  color: #6BCB77;
}

/* ─── Character Count ─── */
.char-count {
  font-size: 0.75rem;
  color: var(--main-text-color);
  opacity: 0.6;
  text-align: right;
  margin-top: -0.25rem;
}
</style>
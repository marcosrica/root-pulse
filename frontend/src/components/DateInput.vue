<script setup lang="ts">
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  modelValue?: string      // always YYYY-MM-DD
  label?: string
  min?: string
  max?: string
  disabled?: boolean
  required?: boolean
  error?: string
  helperText?: string
  name?: string
}>(), {
  modelValue: '',
  disabled: false,
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
  change: [value: string]
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

const inputRef = ref<HTMLInputElement | null>(null)

const onInput = (event: Event) => {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}

const onChange = (event: Event) => {
  emit('change', (event.target as HTMLInputElement).value)
}

const onFocus = (event: FocusEvent) => emit('focus', event)
const onBlur = (event: FocusEvent) => emit('blur', event)

// Optional: open the native picker programmatically where supported
const openPicker = () => {
  inputRef.value?.showPicker?.()
}
</script>

<template>
  <div class="native-date-wrapper">
    <label v-if="label" class="native-date-label">
      {{ label }}
      <span v-if="required" class="required-star">*</span>
    </label>

    <div
      class="native-date-container"
      :class="{
        'is-disabled': disabled,
        'is-invalid': !!error
      }"
    >
      <input
        ref="inputRef"
        class="native-date-input"
        type="date"
        :value="modelValue"
        :min="min"
        :max="max"
        :disabled="disabled"
        :required="required"
        :name="name"
        @input="onInput"
        @change="onChange"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div v-if="error || helperText" class="native-date-message">
      <span :class="{ 'text-error': error }">
        {{ error || helperText }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.native-date-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
  width: 100%;
}

.native-date-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--main-text-color);
  transition: var(--transition-theme);
}

.required-star {
  color: #FF6B6B;
  margin-left: 2px;
}

.native-date-container {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  background: var(--background);
  border: 2px solid var(--div-border);
  border-radius: 12px;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.native-date-container:focus-within {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--btn-primary-bg, #2D8A4E);
}

.native-date-container.is-invalid {
  border-color: #FF6B6B;
  box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.1);
}

.native-date-container.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.native-date-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  color: var(--main-text-color);
  color-scheme: light;
  cursor: pointer;
}

/* Let the native picker follow dark mode */
[data-theme="dark"] .native-date-input {
  color-scheme: dark;
}

/* Chrome/Safari: style the native calendar icon */
.native-date-input::-webkit-calendar-picker-indicator {
  cursor: pointer;
  border-radius: 6px;
  padding: 4px;
  opacity: 0.6;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.native-date-input::-webkit-calendar-picker-indicator:hover {
  opacity: 1;
  background: rgba(255, 255, 255, 0.1);
}

.native-date-input:disabled {
  cursor: not-allowed;
}

.native-date-message {
  font-size: 0.8125rem;
  min-height: 1.25rem;
  color: var(--main-text-color);
  opacity: 0.7;
}

.text-error {
  color: #FF6B6B;
  opacity: 1;
}
</style>
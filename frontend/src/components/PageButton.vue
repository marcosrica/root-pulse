<script setup lang="ts">
import { Loader } from 'lucide-vue-next'

// Props
const props = withDefaults(defineProps<{
  variant?: 'primary' | 'danger' | 'gold'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  iconOnly?: boolean
  leftIcon?: any
  rightIcon?: any
  icon?: any
}>(), {
  variant: 'primary',
  size: 'md',
  type: 'button',
  disabled: false,
  loading: false,
  block: false,
  iconOnly: false
})

// Emits
const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

// Methods
const handleClick = (event: MouseEvent) => {
  // Access loading via props
  if (!props.loading) {
    emit('click', event)
  }
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      `btn-${variant}`,
      `btn-${size}`,
      {
        'btn-loading': loading,
        'btn-block': block,
        'btn-icon-only': iconOnly
      }
    ]"
    @click="handleClick"
  >
    <!-- Loading Spinner -->
    <span v-if="loading" class="spinner">
      <Loader class="spinner-icon" />
    </span>

    <!-- Left Icon -->
    <component
      v-if="leftIcon && !loading && typeof leftIcon !== 'string'"
      :is="leftIcon"
      class="btn-icon btn-icon-left"
    />
    <!-- Left Icon – mask -->
    <div
      v-else-if="leftIcon && !loading && typeof leftIcon === 'string'"
      class="btn-icon btn-icon-left btn-icon-mask"
      :style="{
        maskImage: `url(${leftIcon})`,
        WebkitMaskImage: `url(${leftIcon})`
      }"
    />

    <!-- Text Content -->
    <span v-if="!iconOnly" class="btn-text">
      <slot />
    </span>

    <!-- Right Icon -->
    <component
      v-if="rightIcon && !loading && typeof rightIcon !== 'string'"
      :is="rightIcon"
      class="btn-icon btn-icon-right"
    />
    <!-- Right Icon – mask (string → SVG path) -->
    <div
      v-else-if="rightIcon && !loading && typeof rightIcon === 'string'"
      class="btn-icon btn-icon-right btn-icon-mask"
      :style="{
        maskImage: `url(${rightIcon})`,
        WebkitMaskImage: `url(${rightIcon})`
      }"
    />

    <!-- Icon Only Mode -->
    <component
      v-if="iconOnly && !loading && typeof icon !== 'string'"
      :is="icon"
      class="btn-icon"
    />
    <!-- Icon Only – mask -->
    <div
      v-else-if="iconOnly && !loading && typeof icon === 'string'"
      class="btn-icon btn-icon-mask"
      :style="{
        maskImage: `url(${icon})`,
        WebkitMaskImage: `url(${icon})`
      }"
    />
  </button>
</template>

<style scoped>
/* ─── Base Button ─── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px solid transparent;
  border-radius: 0.75rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  user-select: none;
  white-space: nowrap;
  text-decoration: none;
  outline: none;
}

.btn:focus-visible {
  outline: 2px solid var(--btn-primary-bg);
  outline-offset: 2px;
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

/* ─── Sizes ─── */
.btn-xs {
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 0.5rem;
  gap: 0.25rem;
}

.btn-sm {
  padding: 0.5rem 0.875rem;
  font-size: 0.8125rem;
  border-radius: 0.625rem;
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: 0.9375rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.0625rem;
}

.btn-xl {
  padding: 0.875rem 2rem;
  font-size: 1.125rem;
  border-radius: 1rem;
}

/* ─── Variants ─── */

/* Primary */
.btn-primary {
  background: rgba(45, 138, 78, 0);
  color: var(--div-border);
  border: 2px solid var(--div-border);
  box-shadow: 0 2px 8px rgba(45, 138, 78, 0.25);
}

.btn-primary:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid var(--div-border);
  box-shadow: 0 4px 12px rgba(45, 138, 78, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active:not(:disabled) {
  background: rgba(255, 255, 255, 0.25);
  border: 2px solid var(--div-border);
  box-shadow: 0 1px 4px rgba(45, 138, 78, 0.2);
}

/* Danger */
.btn-danger {
  background: var(--btn-danger-bg);
  color: var(--btn-danger-text);
  border-color: var(--btn-danger-bg);
  box-shadow: 0 2px 8px rgba(255, 68, 68, 0.25);
}

.btn-danger:hover:not(:disabled) {
  background: var(--btn-danger-hover);
  border-color: var(--btn-danger-hover);
  box-shadow: 0 4px 12px rgba(255, 68, 68, 0.35);
  transform: translateY(-1px);
}

.btn-danger:active:not(:disabled) {
  background: var(--btn-danger-active);
  border-color: var(--btn-danger-active);
}

/* ─── States ─── */

/* Disabled */
.btn:disabled {
  opacity: var(--btn-disabled-opacity);
  cursor: not-allowed;
  pointer-events: none;
}

/* Loading */
.btn-loading {
  cursor: wait;
  pointer-events: none;
}

.btn-loading .btn-text,
.btn-loading .btn-icon {
  opacity: 0;
}

/* Block (full width) */
.btn-block {
  width: 100%;
  display: flex;
}

/* Icon Only */
.btn-icon-only {
  padding: 0.5rem;
  aspect-ratio: 1;
}

.btn-xs.btn-icon-only {
  padding: 0.25rem;
}

.btn-sm.btn-icon-only {
  padding: 0.375rem;
}

.btn-md.btn-icon-only {
  padding: 0.5rem;
}

.btn-lg.btn-icon-only {
  padding: 0.625rem;
}

.btn-xl.btn-icon-only {
  padding: 0.75rem;
}

/* ─── Icons ─── */
.btn-icon {
  width: 1.125rem;
  height: 1.125rem;
  flex-shrink: 0;
}

.btn-xs .btn-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.btn-xl .btn-icon {
  width: 1.375rem;
  height: 1.375rem;
}

/* ─── Spinner ─── */
.spinner {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-icon {
  width: 1.25rem;
  height: 1.25rem;
  animation: spin 0.8s linear infinite;
}

.btn-icon-mask {
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.btn-gold {
    background-color: #ffd700;
    cursor: default;
    pointer-events: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
<script setup lang="ts">
defineProps<{
  options: string[]           // e.g. ['Home', 'Profile']
  modelValue: string          // currently selected option
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const select = (value: string) => {
  emit('update:modelValue', value)
}
</script>

<template>
  <div class="toggle-bar">
    <!-- Sliding glass indicator -->
    <div
      class="indicator"
      :style="{
        transform: `translateX(${options.indexOf(modelValue) * 100}%)`,
        width: `calc(100% / ${options.length})`
      }"
    />

    <!-- Option buttons -->
    <button
      v-for="option in options"
      :key="option"
      class="toggle-option"
      :class="{ active: option === modelValue }"
      @click="select(option)"
    >
      {{ option }}
    </button>
  </div>
</template>

<style scoped>
.toggle-bar {
  position: relative;
  display: flex;
  border: 2px solid var(--div-border);
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.05);   /* subtle background */
  overflow: hidden;
  user-select: none;
}

/* Glass pill indicator – inherits the look of your glassMenuOption */
.indicator {
    position: absolute;
      top: 2px;
      bottom: 2px;
      left: 2px;
      border-radius: 100px;
      backdrop-filter: blur(12px) saturate(180%);
      background: var(--glass-bg);
      border: var(--glass-border);
      box-shadow: var(--glass-shadow);
      z-index: 0;
      transition: transform 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.toggle-option {
  position: relative;
  flex: 1;
  padding: 0.6rem 1.25rem;
  font-weight: 600;
  font-family: inherit;
  font-size: 0.9rem;
  border: none;
  background: transparent;
  color: var(--div-border);
  cursor: pointer;
  z-index: 1;
  transition: color 0.2s;
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
}

.toggle-option.active {
    color: var(--toggle-text-active);
    text-shadow: 0 1px 3px rgba(0,0,0,0.3);
}

/* Remove default button focus and add a custom one */
.toggle-option:focus-visible {
  outline: 2px solid var(--btn-primary-bg);
  outline-offset: -2px;
  border-radius: 100px;
}
</style>
<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'

const props = defineProps<{
  options: string[]
  modelValue: string
  placeholder?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const open = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)
const optionRefs = ref<HTMLElement[]>([])   // ref array for all option buttons

// Reactive indicator style
const indicatorStyle = ref({ top: '0px', height: '0px' })

// --- Methods ---
const select = (option: string) => {
  emit('update:modelValue', option)
  open.value = false
}

const toggle = () => {
  open.value = !open.value
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

// Measure and update indicator position
const updateIndicator = async () => {
  await nextTick()
  const selectedIndex = props.options.indexOf(props.modelValue)
  if (selectedIndex >= 0 && optionRefs.value[selectedIndex]) {
    const el = optionRefs.value[selectedIndex] as HTMLElement
    const menu = dropdownRef.value?.querySelector('.dropdown-menu') as HTMLElement | null
    if (menu && el.offsetParent === menu) {
      // offsetTop is relative to the menu (its offset parent)
      indicatorStyle.value = {
        top: el.offsetTop + 'px',
        height: el.offsetHeight + 'px'
      }
    }
  } else {
    indicatorStyle.value = { top: '0px', height: '0px' }
  }
}

// Watchers
watch(() => props.modelValue, updateIndicator)
watch(open, async (isOpen) => {
  if (isOpen) await updateIndicator()
})

// Lifecycle
import { onMounted, onBeforeUnmount } from 'vue'
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})
onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="dropdown" ref="dropdownRef">
    <!-- Trigger button -->
    <button class="dropdown-trigger" @click="toggle" type="button">
      <span v-if="modelValue" class="selected-text">{{ modelValue }}</span>
      <span v-else class="placeholder">{{ placeholder || 'Select...' }}</span>
      <!-- Chevron icon (mask) -->
      <div class="chevron-icon" :class="{ open: open }" />
    </button>

    <!-- Dropdown menu -->
    <Transition name="dropdown">
      <div v-if="open" class="dropdown-menu">
        <!-- Sliding glass indicator – now dynamically sized and positioned -->
        <div
          class="menu-indicator"
          :style="{
            top: indicatorStyle.top,
            height: indicatorStyle.height
          }"
        />
        <button
          v-for="(option, index) in options"
          :key="option"
          :ref="el => { if (el) optionRefs[index] = el as HTMLElement }"
          class="menu-option"
          :class="{ active: option === modelValue }"
          @click="select(option)"
        >
          {{ option }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  width: 200px;
  user-select: none;
}

/* Trigger */
.dropdown-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 0.6rem 1rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  border-radius: 100px;
  box-shadow: var(--glass-shadow);
  backdrop-filter: blur(12px) saturate(180%);
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--div-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  border-color: rgba(128,128,128,0.4);
}

.placeholder {
  opacity: 0.5;
  font-weight: 400;
}

/* Chevron icon */
.chevron-icon {
  width: 1rem;
  height: 1rem;
  background-color: var(--div-border);
  mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
  -webkit-mask-size: contain;
  transition: transform 0.2s ease;
}

.chevron-icon.open {
  transform: rotate(180deg);
}

/* Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 100%;
  background: var(--glass-bg);
  backdrop-filter: blur(20px) saturate(200%);
  border: var(--glass-border);
  border-radius: 1rem;
  box-shadow: var(--glass-shadow);
  overflow: hidden;
  z-index: 50;
  display: flex;
  flex-direction: column;
  padding: 4px;
}

/* Glass indicator – now positioned by JS */
.menu-indicator {
  position: absolute;
  left: 4px;
  right: 4px;
  border-radius: 0.75rem;
  background: var(--glass-bg);
  border: var(--glass-border);
  box-shadow: var(--glass-shadow);
  z-index: 0;
  transition: top 0.35s cubic-bezier(0.25, 0.8, 0.25, 1),
              height 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* Menu option buttons */
.menu-option {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  padding: 0.6rem 1rem;
  border: none;
  background: transparent;
  font-family: inherit;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--div-border);
  cursor: pointer;
  transition: color 0.2s, text-shadow 0.2s;
  border-radius: 0.75rem;
}

.menu-option.active {
  color: var(--toggle-text-active);
  text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* Hover effect – subtle text highlight */
.menu-option:hover {
  color: var(--toggle-text-active);
  text-shadow: 0 0 4px rgba(0,0,0,0.1);
}

.menu-option:focus-visible {
  outline: 2px solid var(--btn-primary-bg);
  outline-offset: -2px;
}

/* Transitions */
.dropdown-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
.dropdown-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}
</style>
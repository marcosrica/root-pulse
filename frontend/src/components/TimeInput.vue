<script setup>
import { ref, watch, computed } from 'vue';

const hours = ref('');
const minutes = ref('');
const hoursInput = ref(null);
const minutesInput = ref(null);

// Emit the combined time value whenever hours or minutes change
const emit = defineEmits(['update:modelValue']);

const timeString = computed(() => {
    if (hours.value && minutes.value) {
        return `${hours.value.padStart(2, '0')}:${minutes.value.padStart(2, '0')}`;
    }
  return '';
});

watch(timeString, (newVal) => {
    emit('update:modelValue', newVal);
});

// Handle hours input: allow only 0-23
function handleHoursInput() {
    let val = hours.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    if (val !== '') {
        const num = parseInt(val, 10);
    }
    hours.value = val;
  
    // Auto-advance to minutes when two digits are entered
    if (val.length === 2) {
        minutesInput.value?.focus();
    }
}

// Handle minutes input: allow only 0-59
function handleMinutesInput() {
    let val = minutes.value.replace(/[^0-9]/g, '');
    if (val.length > 2) val = val.slice(0, 2);
    if (val !== '') {
        const num = parseInt(val, 10);
        if (num > 59) val = '59';
    }
    minutes.value = val;
}

// Handle keyboard navigation (backspace, arrows, colon)
function handleKeyDown(event, field) {
    if (event.key === 'Backspace' && field === 'minutes' && minutes.value === '') {
        // Move focus back to hours when minutes are empty
        hoursInput.value?.focus();
    }
    if (event.key === ':' && field === 'hours') {
        event.preventDefault();
        minutesInput.value?.focus();
    }
    // Optional: allow arrow keys to move between fields
    if (event.key === 'ArrowRight' && field === 'hours' && hours.value.length === 2) {
        minutesInput.value?.focus();
    }
    if (event.key === 'ArrowLeft' && field === 'minutes' && minutes.value === '') {
        hoursInput.value?.focus();
    }
}
</script>

<template>
    <div class="time-input-container">
        <!-- Hours field -->
        <input
            ref="hoursInput"
            v-model="hours"
            class="time-field hours-field"
            type="text"
            inputmode="numeric"
            maxlength="2"
            placeholder="HH"
            @input="handleHoursInput"
            @keydown="handleKeyDown($event, 'hours')"
            @focus="$event.target.select()"
        />
    
        <span class="time-colon">:</span>
    
        <!-- Minutes field -->
        <input
            ref="minutesInput"
            v-model="minutes"
            class="time-field minutes-field"
            type="text"
            inputmode="numeric"
            maxlength="2"
            placeholder="MM"
            @input="handleMinutesInput"
            @keydown="handleKeyDown($event, 'minutes')"
            @focus="$event.target.select()"
        />
    </div>
</template>

<style scoped>
    .time-input-container {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        background: var(--background);
        border: 2px solid var(--div-border);
        border-radius: 12px;
        transition: box-shadow 0.2s ease;
    }

    .time-input-container:focus-within {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    
    .time-field {
        width: 3.5rem;
        padding: 0.5rem;
        border: 2px solid transparent;
        border-radius: 8px;
        font-size: 1.5rem;
        font-weight: 600;
        text-align: center;
        outline: none;
        transition: all 0.2s ease;
    }
    
    /* Two-tone colors: hours get a warm tone, minutes a cool tone */
    .hours-field {
        background: var(--background);   /* light peach */
        color: #e65100;           /* deep orange */
        border-color: #ffccbc;
    }

    .hours-field:focus {
        border-color: #ff9800;
        background: var(--background);
    }
    
    .minutes-field {
        background: var(--background);
        color: #0d47a1;
        border-color: #bbdefb;
    }
    
    .minutes-field:focus {
        border-color: #2196f3;
        background: var(--background);
    }
    
    .time-colon {
        font-size: 1.8rem;
        font-weight: 700;
        color: #90a4ae;
        user-select: none;
    }
</style>
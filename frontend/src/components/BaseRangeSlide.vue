<script setup>
    import { ref, computed, watch, onBeforeUnmount } from 'vue';
    
    const props = defineProps({
        min: { type: Number, default: 0 },
        max: { type: Number, default: 100 },
        step: { type: Number, default: 1 },
        modelValue: { type: Array, default: () => [0, 100] },
    });
    
    const emit = defineEmits(['update:modelValue']);
    
    const minValue = ref(props.modelValue[0]);
    const maxValue = ref(props.modelValue[1]);
    
    // Sync internal values when parent changes them
    watch(() => props.modelValue, (newVal) => {
        minValue.value = newVal[0];
        maxValue.value = newVal[1];
    });

    const minPercent = computed(() => ((minValue.value - props.min) / (props.max - props.min)) * 100);
    const maxPercent = computed(() => ((maxValue.value - props.min) / (props.max - props.min)) * 100);
    
    let activeHandle = null; // 'min' or 'max'
    let sliderRect = null;
    
    function startDrag(handle, event) {
        activeHandle = handle;
        sliderRect = event.currentTarget.parentElement.getBoundingClientRect();
        window.addEventListener('pointermove', onDrag);
        window.addEventListener('pointerup', stopDrag);
        event.preventDefault();
    }

    function onDrag(event) {
        if (!activeHandle || !sliderRect) { return; }
        
        const x = event.clientX - sliderRect.left;
        const percent = Math.min(Math.max(x / sliderRect.width, 0), 1);
        let rawValue = props.min + percent * (props.max - props.min);
        
        // Apply step
        rawValue = Math.round(rawValue / props.step) * props.step;
        rawValue = Math.min(props.max, Math.max(props.min, rawValue));
        
        if (activeHandle === 'min') {
            minValue.value = Math.min(rawValue, maxValue.value);
        } else {
            maxValue.value = Math.max(rawValue, minValue.value);
        }
        
        emit('update:modelValue', [minValue.value, maxValue.value]);
    }

    function stopDrag() {
        activeHandle = null;
        window.removeEventListener('pointermove', onDrag);
        window.removeEventListener('pointerup', stopDrag);
    }
    
    onBeforeUnmount(() => {
        window.removeEventListener('pointermove', onDrag);
        window.removeEventListener('pointerup', stopDrag);
    });
</script>

<template>
    <div class="range-slider">
        <!-- Track background -->
        <div class="slider-track"></div>
    
        <!-- Highlighted range between min and max -->
        <div
            class="slider-range"
            :style="{
                left: minPercent + '%',
                width: (maxPercent - minPercent) + '%',
        }" 
        ></div>
    
        <!-- Min handle -->
        <div
        class="slider-handle handle-min"
            :style="{ left: minPercent + '%' }"
            @pointerdown="startDrag('min', $event)"
        >
            <span class="handle-value">{{ minValue }}</span>
        </div>
    
        <!-- Max handle -->
        <div
            class="slider-handle handle-max"
            :style="{ left: maxPercent + '%' }"
        @pointerdown="startDrag('max', $event)"
        >
            <span class="handle-value">{{ maxValue }}</span>
        </div>
    </div>
</template>

<style scoped>
    .range-slider {
        box-sizing: border-box;
        position: relative;
        width: 90%;
        height: 60px;
        user-select: none;
        touch-action: none;
    }
    
    .slider-track {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        height: 6px;
        transform: translateY(-50%);
        background: #e0e0e0;
        border-radius: 3px;
    }
    
    .slider-range {
        position: absolute;
        top: 50%;
        height: 6px;
        transform: translateY(-50%);
        background: linear-gradient(90deg, var(--danger), var(--ok));
        border-radius: 3px;
    }
    
    .slider-handle {
        position: absolute;
        top: 50%;
        width: 24px;
        height: 24px;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        cursor: grab;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        transition: transform 0.1s ease, box-shadow 0.1s ease;
    }
    
    .slider-handle:active {
        cursor: grabbing;
        transform: translate(-50%, -50%) scale(1.1);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    }

    .handle-min {
        background: var(--danger);
        border: 2px solid var(--btn-danger-hover);
    }
    
    .handle-max {
        background: var(--ok);
        border: 2px solid var(--btn-primary-active);
    }
    
    .handle-value {
        position: absolute;
        top: -28px;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.75rem;
        font-weight: 600;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 2px 6px;
        border-radius: 4px;
        pointer-events: none;
        white-space: nowrap;
    }
</style>
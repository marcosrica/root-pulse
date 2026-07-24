<script setup lang="ts">
const props = defineProps <{
  show: boolean
  hide: () => void
}>();

</script>

<template>
    <div :class="['background', show ? 'active' : 'inactive']" v-on:click="hide">
        <div :class="['panel', show ? '' : 'panelInactive']" @click.stop>
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.background {
    position: fixed;
    top: 0px;
    right: 0px;
    
    width: 100dvw;
    height: 100dvh;

    z-index: 1000000;
    transition: 0.6s;
}

.active {
    background-color: #000000b5;
    pointer-events: all;
}

.inactive {
    background-color: transparent;
    pointer-events: none;
}

.panel {
    background-color: var(--background);
    border: 3px solid var(--div-border);
    border-radius: 20px;

    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    transition: 0.4s;
    pointer-events: all;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}

.panelInactive {
    pointer-events: none;

    top: 150%;
}
</style>
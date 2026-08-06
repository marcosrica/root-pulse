<script setup lang="ts">
const props = defineProps<{
    click?:() => void,
}>();
</script>

<template>
    <div class="card" v-on:click="click">
        <slot />
    </div>
</template>

<style scoped>
    .card {
        padding: 10px;
        
        border: 3px solid var(--div-border);

        border-radius: 20px;
    }
</style>
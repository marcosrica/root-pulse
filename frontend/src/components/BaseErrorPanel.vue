<script setup lang="ts">
//background-color: var(--btn-danger-bg);
</script>

<template>
    <div class="card">
        <slot />
    </div>
</template>

<style scoped>
    .card {
        padding: 10px;
        
        border: 3px solid var(--danger);
        background-color: var(--error-bg);
        color: var(--error-color);

        border-radius: 20px;
    }
</style>
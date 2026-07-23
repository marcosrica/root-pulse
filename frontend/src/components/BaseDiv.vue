<script setup lang="ts">

</script>

<template>
    <div class="card">
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
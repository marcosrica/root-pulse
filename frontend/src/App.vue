<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useTheme } from './composables/userTheme';

const {currentTheme} = useTheme();
</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>

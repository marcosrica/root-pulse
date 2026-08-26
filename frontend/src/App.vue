<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRoute } from 'vue-router'
import apiClient from './Utilities/MakePetition';

onMounted(async () => {
    if (!location.href.includes("/auth")) {
        try {
            const response = await apiClient.get("/user/logged");
            location.href = "/home";
        }
        catch (e) {
            location.href = "/auth/login";
        }
    }
});
</script>

<template>
  <RouterView />
</template>

<style>
  body {
    color: var(--main-text-color);
  }
</style>

<script setup lang="ts">

</script>

<template>
  <div class="background active">
      
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
    transition: 0.5s;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.active {
    background-color: #000000b5;
}

.inactive {
    background-color: transparent;;
}
</style>
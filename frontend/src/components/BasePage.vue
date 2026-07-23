<script setup lang="ts">

</script>

<template>
    <div class="background">
        <div class="sideMenuWrapper">
            <div class="sideMenu">
                
            </div>
        </div>
        
        <div class="content">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
    .background {
        width: 100dvw;
        height: 100dvh;

        background-color: var(--background);

        display: flex;
        flex-direction: row;

        @media(orientation: portrait) {
            flex-direction: column-reverse;
        }
    }

    .sideMenuWrapper {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        
        width: 4%;
        height: 100%;

        @media(orientation: portrait) {
            width: 100%;
            height: 8%;
        }
    }

    .sideMenu {
        width: 80%;
        height: 90%;

        border: 2px solid var(--div-border);
        border-radius: 20px;

        @media(orientation: portrait) {
            width: 100%;
            height: 80%;
        }
    }

    .content {
        background-color: orange;

        flex: 1;
    }
</style>
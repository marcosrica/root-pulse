<script setup lang="ts">
    let props = defineProps<{
        location: string
    }>();
</script>

<template>
    <div class="background">
        <div class="sideMenuWrapper">
            <div class="sideMenu">
                <div :class="['menuOption', location == 'home' ? 'glassMenuOption' : '']">
                    <div class="menuOptionIcon homeIcon"/>
                </div>

                <div :class="['menuOption', location == 'profile' ? 'glassMenuOption' : '']">
                    <div class="menuOptionIcon profileIcon"/>
                </div>
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
        box-sizing: border-box;
        
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 0px;
        padding-right: 0px;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        
        width: 80%;
        max-height: 90%;

        border: 2px solid var(--div-border);
        border-radius: 20px;

        @media(orientation: portrait) {
            width: auto;
            max-width: 100%;
            height: 80%;
            flex-direction: row;

            padding-top: 0px;
            padding-bottom: 0px;
            padding-left: 10px;
            padding-right: 10px;
        }
    }

    .content {
        background-color: orange;

        flex: 1;
    }

    .menuOption {
        padding: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .glassMenuOption {
        background-color: red;
    }
    
    .menuOptionIcon {
        box-sizing: border-box;
        cursor: pointer;
        background-color: var(--div-border);

        @media(orientation:portrait) {
            height: 90%;
            aspect-ratio: 1;
        }   

        @media(orientation: landscape) {
            width: 90%;
            aspect-ratio: 1;
        }
        
        mask-size: contain;
    }

    .homeIcon {
        mask-image: url('/icons/Home.svg');
    }

    .profileIcon {
        mask-image: url('/icons/Profile.svg');
    }
</style>
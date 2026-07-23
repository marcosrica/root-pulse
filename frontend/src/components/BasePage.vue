<script setup lang="ts">
    let props = defineProps<{
        location: string
    }>();

    const changeView = (route:string) => {
      location.href = route;
    }
</script>

<template>
    <div class="background">
        <div class="sideMenuWrapper">
            <div class="sideMenu">
                <div :class="['menuOption', location == 'home' ? 'glassMenuOption' : '']">
                    <div class="menuOptionIcon homeIcon" v-on:click="changeView('/home')"/>
                </div>

                <div :class="['menuOption', location == 'profile' ? 'glassMenuOption' : '']">
                    <div class="menuOptionIcon profileIcon" v-on:click="changeView('/profile')"/>
                </div>
            </div>
        </div>
        
        <div class="content">
            <div class="scrollable">
                <slot></slot>
            </div>
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
        
        padding-top: 2px;
        padding-bottom: 2px;
        padding-left: 0px;
        padding-right: 0px;
        
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;
        
        width: 80%;
        max-height: 90%;

        border: 2px solid var(--div-border);
        border-radius: 100px;

        @media(orientation: portrait) {
            width: auto;
            max-width: 100%;
            height: 80%;
            flex-direction: row;

            padding-top: 0px;
            padding-bottom: 0px;
            padding-left: 2px;
            padding-right: 2px;
        }
    }

    .content {
        flex: 1;

        display: flex;
        flex-direction:column;
        justify-content: flex-start;
        align-items: center;

        overflow: auto;
    }

    .scrollable {
        width: 90%;
        max-width: 1000px;
        height: 2000px;

        margin-top: 20px;
        margin-bottom: 20px;

        @media(orientation: portrait) {
            width: 95%;
        }
    }

    .menuOption {
        padding: 5px;

        display: flex;
        align-items: center;
        justify-content: center;
        
        box-sizing: border-box;
        margin: 2px;
        border-radius: 1000px;

        backdrop-filter: blur(40px);
    }

    .glassMenuOption {
        backdrop-filter: blur(12px) saturate(180%);
        background: radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(255, 255, 255, 0.25) 0%,
            rgba(255, 255, 255, 0.05) 60%,
            rgba(255, 255, 255, 0.02) 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.3);
        box-shadow:
            0 15px 35px rgba(0, 0, 0, 0.3),
            0 0 0 0.5px rgba(255, 255, 255, 0.1) inset,
            0 0 20px rgba(255, 255, 255, 0.2);
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
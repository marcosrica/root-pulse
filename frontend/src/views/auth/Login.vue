<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';
import plantIconUrl from '@/../public/Icons/Logo.svg'
import { Form } from 'lucide-vue-next';
import BaseInput from '@/components/Forms/BaseInput.vue';
import { ref } from 'vue';

const plantName = ref<string>("");
</script>

<template>
    <div class="app">
        <BaseCard class="wrapper">
            <div class="Content">
                <div class="Logo">
                    <img class="LogoSVG" :src="plantIconUrl"></img>
                </div>

                <div class="Form">
                    <div class="ServiceName">
                        <h1 class="ServiceText"> Root Pulse </h1>
                    </div>

                    <form>
                        <BaseInput
                            v-model="plantName" 
                            label="Plant Name"
                            placeholder="Enter plant name..."
                            type="number"

                        />
                    </form>
                </div>
            </div>
        </BaseCard>
    </div>
</template>

<style>
    .app {
        background: linear-gradient(307deg, #0bff00, #0004fe);;
        width: 100dvw;
        height: 100dvh;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wrapper {
        @media(orientation: portrait) {
            max-width: 90%;
        }
    }

    /* #region service name */
    .ServiceName {
        border-bottom: 0.5dvw solid var(--div-border);
    }

    .ServiceText {
        margin: 0px;
        font-size: 8dvw;

        @media(orientation: portrait) {
            font-size: 18dvw;
        }
    }
    /* #endregion */

    /* #region login content */
    .Content {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: row;

        @media(orientation: portrait) {
            flex-direction: column;
        }
    }

    .Logo {
        width: 50%;
        height: 50%;

        @media(orientation: portrait) {
            width: 80%;
        }
    }

    .LogoSVG {
        width: 100%;
        height: 100%;
    }
    /* #endregion */

    /* #region form content*/

    /* #endregion */
</style>
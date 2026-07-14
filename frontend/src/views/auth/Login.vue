<script setup lang="ts">
import BaseCard from '@/components/BaseCard.vue';
import plantIconUrl from '@/../public/Icons/Logo.svg'
import BaseInput from '@/components/Forms/BaseInput.vue';
import { ref } from 'vue';
import BaseButton from '@/components/Forms/BaseButton.vue';
import { useI18n } from '@/locales/i18n';
import apiClient, { ApiError } from '@/Utilities/MakePetition';

const { t } = useI18n()

const username = ref<string>("");
const password = ref<string>("");

const handleLogin = async () => {
    const loginData = {
        username: username.value,
        password: password.value
    }

    console.log("Trying to login with data:");
    console.log(loginData)

    try {
        const response = await apiClient.post('/login', loginData)
        console.log('Responded:', response.data)
    } catch (error) {
        console.error('Failed to login', error)
    }
}
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

                    <form  @submit.prevent="handleLogin">
                        <div class="FormInput">
                            <h2 class="FormText"> {{ t("auth.username") }} </h2>
                            <BaseInput
                                v-model="username"
                                :placeholder="t('auth.username')"
                            />
                        </div>

                        <div class="FormInput">
                            <h2 class="FormText"> {{t("auth.password")}} </h2>
                            <BaseInput
                                v-model="password"
                                :placeholder="t('auth.password')"
                                type="password"
                            />
                        </div>

                        <div class="FormInput">
                            <BaseButton type="submit" block variant="primary">{{t("auth.login")}}</BaseButton>
                        </div>
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
    .FormText {
        margin: 0px;
        font-size: 1.5dvw;

        @media(orientation: portrait) {
            font-size: 8dvw;
        }
    }

    .FormInput {
        padding-top: 20px;
    }
    /* #endregion */
</style>
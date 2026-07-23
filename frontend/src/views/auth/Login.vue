<script setup lang="ts">
//Various imports
import BaseCard from '@/components/BaseCard.vue';
import plantIconUrl from '@/../public/Icons/Logo.svg'
import BaseInput from '@/components/Forms/BaseInput.vue';
import { ref } from 'vue';
import BaseButton from '@/components/Forms/BaseButton.vue';
import { useI18n } from '@/locales/i18n';
import apiClient, { ApiError } from '@/Utilities/MakePetition';

//Library for easy translation features
const { t } = useI18n()

//Username and password of the user trying to log in
const username = ref<string>("");
const password = ref<string>("");

//Handle the login form submission
const handleLogin = async () => {
    //Wrap the login data in an object
    const loginData = {
        username: username.value,
        password: password.value
    }

    //Trying to contact the backend to try and log in
    try {
        //Sending the petition
        const response = await apiClient.post('/login', loginData);

        if (response.status == 200) {
            //Everything went on fine, and user was logged in
            //Redirecting to home
            location.href = "/home";
        }
    } catch (error) {
        //Something happened along the way
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
        background: linear-gradient(307deg, #0004fe, #0bff00);;
        width: 100dvw;
        height: 100dvh;

        display: flex;
        align-items: center;
        justify-content: center;
    }

    .wrapper {
        backdrop-filter: blur(50px) saturate(4);
    
        @media(orientation: portrait) {
            max-width: 90%;

            @media(min-width: 600px) {
            max-width: 70%;
            }
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

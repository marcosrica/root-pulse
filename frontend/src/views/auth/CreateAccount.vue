<script setup lang="ts">
//Various imports
import BaseCard from '@/components/BaseCard.vue';
import plantIconUrl from '@/../public/icons/Logo.svg'
import BaseInput from '@/components/Forms/BaseInput.vue';
import { ref } from 'vue';
import BaseButton from '@/components/Forms/BaseButton.vue';
import { useI18n } from '@/locales/i18n';
import apiClient, { ApiError } from '@/Utilities/MakePetition';

//Library for easy translation features
const { t } = useI18n()

//Username and password of the new account
const username = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");

//Track wether passwords match
const passwordsMatch = ref<boolean>(true);
const emptyFields = ref<boolean>(false);

//Handle a change in the passwords
const passwordsChanged = () => {
    if (password.value != "" && confirmPassword.value != "") {
        passwordsMatch.value = (password.value == confirmPassword.value);
    }
    else {
      passwordsMatch.value = true;
    }
}

//Handle the account creation form submission
const handleCreateAccount = async () => {
    //Wrap the login data in an object
    const accountData = {
        username: username.value,
        password: password.value
    }

    //Checking for null values
    if (username.value != "" && password.value != "" && confirmPassword.value != "") {
        emptyFields.value = false;
        
        //Checking if the passwords match
        if (passwordsMatch.value) {
            //Trying to call the backend
            try {
                const response = await apiClient.post("/auth/newAccount", accountData);
                console.log(response)
                
                //Checking if everything went through fine
                if (response.status == 200 || response.status == 201) {
                    //Redirecting to the home page
                    //location.href = "/home";
                }
            }
            catch {
              
            }
        }
    }
    else {
        emptyFields.value = true;
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
                        <h1 class="ServiceText"> {{t("auth.createAccount")}} </h1>
                    </div>

                    <BaseCard class="Error" v-if="!passwordsMatch">
                        <p class="errorText"> {{t("auth.passwordsDontMatch")}} </p>
                    </BaseCard>
                    
                    <BaseCard class="Error" v-if="emptyFields">
                        <p class="errorText"> {{t("auth.noEmptyFields")}} </p>
                    </BaseCard>
                    
                    <form  @submit.prevent="handleCreateAccount">
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
                                :changed="passwordsChanged"
                            />
                        </div>

                        <div class="FormInput">
                            <h2 class="FormText"> {{t("auth.confirmPassword")}} </h2>
                            <BaseInput
                                v-model="confirmPassword"
                                :placeholder="t('auth.confirmPassword')"
                                type="password"
                                :changed="passwordsChanged"
                            />
                        </div>

                        <div class="FormInput">
                            <BaseButton type="submit" block variant="primary">{{t("auth.createAccount")}}</BaseButton>
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

    .errorText {
        text-align: center;
        margin: 0px;
        font-size: 1.5dvw;

        @media(orientation: portrait) {
            font-size: 4dvw;
        }
    }

    /* #region service name */
    .ServiceName {
        border-bottom: 0.5dvw solid var(--div-border);
    }

    .ServiceText {
        margin: 0px;
        font-size: 6dvw;

        @media(orientation: portrait) {
            font-size: 12dvw;
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
            width: 60%;
        }
    }

    .LogoSVG {
        width: 100%;
        height: 100%;
    }

    .Error {
        background-color: #ff5c5cb8;
        margin-top: 10px;
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

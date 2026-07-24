<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import BaseDiv from '@/components/BaseDiv.vue';
import type { userInfo } from '@/Utilities/types/UserInfo';
import { useI18n } from '@/locales/i18n';
import ToggleBar from '@/components/ToggleBar.vue';
import { ref } from 'vue';
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore();

//Library for easy translation features
const { t } = useI18n();

const currentTheme = ref('Home');

let info: userInfo = {
  username: "TestUser",
  language: "en",
  theme: "dark",
  id: 1,
}


const changedTheme = () => {
    if (currentTheme.value == t("theme.dark")) {
        themeStore.setTheme('dark');
    }
    else {
        themeStore.setTheme('light');
    }
}
</script>

<template>
    <BasePage location="profile">
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{info.username}} </h1>
        </BaseDiv>

        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("profile.configuration")}} </h1>

            <BaseDiv class="innerDiv">
                <p class="marginless sensorNameText"> {{t("home.checkAll")}} </p>

                <ToggleBar
                  v-model="currentTheme"
                  :options="[t('theme.dark'), t('theme.light')]"
                  @update:modelValue="changedTheme"
                />
            </BaseDiv>
        </BaseDiv>
    </BasePage>
</template>

<style scoped>
.marginless {
    margin: 0px;
}

.headerText {
    font-size: 40px;
    text-align: center;
}

.headerDiv {
    margin-bottom: 30px;
}

.innerDiv {
    margin-bottom: 10px;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
</style>
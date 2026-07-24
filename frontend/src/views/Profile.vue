<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import BaseDiv from '@/components/BaseDiv.vue';
import type { userInfo } from '@/Utilities/types/UserInfo';
import { useI18n } from '@/locales/i18n';
import ToggleBar from '@/components/ToggleBar.vue';
import { onMounted, ref } from 'vue';
import { useThemeStore } from '@/stores/theme'
import Dropdown from '@/components/Dropdown.vue';
import PageButton from '@/components/PageButton.vue';

const themeStore = useThemeStore();

//Library for easy translation features
const { t } = useI18n();
const { currentLocale, setLocale, availableLocales } = useI18n()

const currentTheme = ref('Home');
const currentLang = ref('English')

setLocale("es")

let info: userInfo = {
  username: "TestUser",
  language: "en",
  theme: false,
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

const changedLanguage = () => {
    switch (currentLang.value) {
        case "English":
            setLocale("en");
            break;

        case "Español":
            setLocale("es");
            break;
    }
  }

const getVerboseLanguage = (lang: string) => {
    switch (lang) {
        case "en":
            return "English";

        case "es":
            return "Español";
    }
}

onMounted(() => {
    if (info.theme) {
        currentTheme.value = t('theme.light');
    }
    else {
        currentTheme.value = t('theme.dark');
    }

    currentLang.value = getVerboseLanguage(info.language) || "en";

    changedTheme();
    changedLanguage();
});
</script>

<template>
    <BasePage location="profile">
        <BaseDiv class="headerDiv header">
            <h1 class="marginless headerText"> {{info.username}} </h1>

            <PageButton :iconOnly="true" icon="/icons/Edit.svg" />
        </BaseDiv>

        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("profile.configuration")}} </h1>

            <BaseDiv class="innerDiv">
                <p class="marginless sensorNameText"> {{t("conf.theme")}} </p>

                <ToggleBar
                  v-model="currentTheme"
                  :options="[t('theme.dark'), t('theme.light')]"
                  @update:modelValue="changedTheme"
                />
            </BaseDiv>

            <BaseDiv class="innerDiv">
                <p class="marginless sensorNameText"> {{t("conf.language")}} </p>

                <Dropdown
                v-model="currentLang"
                :options="['English', 'Español']"
                placeholder="Selecciona un idioma"
                @update:modelValue="changedLanguage"
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

.header {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    gap: 30px;
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
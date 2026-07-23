<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import apiClient, { ApiError } from '@/Utilities/MakePetition';
    
    //Library for easy translation features
    const { t } = useI18n();
</script>

<template>
    <BasePage location="home">
        <BaseDiv>
            <h1 class="marginless headerText"> {{t("home.welcomeBack")}} </h1>
        </BaseDiv>

        <BaseDiv>
            <h1 class="marginless headerText"> {{t("home.checkSensors")}} </h1>

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
</style>
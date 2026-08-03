<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import type { SensorInfo } from '@/Utilities/types/SensorInfo';
    import { onMounted, ref } from 'vue';
    import PageInput from '@/components/PageInput.vue';
    
    //Library for easy translation features
    const { t } = useI18n();

    const valueOk = ref<boolean>(true);
    const lastConnection_formatted = ref<string>("");
    
    let data: SensorInfo = {
        name: "Sensor1",
        alias: "",
        lastMeasure: 55,
        minAlert: 30,
        lastConnection: new Date('August 3, 2026 04:28:00')
    };

    const formatTime = (): string => {
        const diffMs = Date.now() - data.lastConnection.getTime()
        const seconds = Math.floor(Math.abs(diffMs) / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours   = Math.floor(minutes / 60)
        const days    = Math.floor(hours / 24)
    
        if (seconds < 60) return t('connection.justNow')
        if (minutes < 60) return t('connection.minutesAgo', { n: minutes })
        if (hours < 24)   return t('connection.hoursAgo',   { n: hours })
        if (days < 30)    return t('connection.daysAgo',    { n: days })
        if (days < 365)   return t('connection.monthsAgo',  { n: Math.floor(days / 30) })
        return t('connection.yearsAgo', { n: Math.floor(days / 365) })
    }
    
    onMounted(() => {
        valueOk.value = data.lastMeasure > data.minAlert;
        lastConnection_formatted.value = formatTime();

        console.log(lastConnection_formatted.value)
    })
</script>

<template>
    <BasePage location="home">
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{data.alias != "" ? data.alias : data.name}} </h1>
        </BaseDiv>

        <BaseDiv class="partDiv">
            <div class="rowContainer">
                <div class="leftDiv">
                    <h1 :class="['marginless', 'lastMeasureCuantity', valueOk ? 'Ok' : 'notOk']"> {{data.lastMeasure}}% </h1>
                    <p class="marginless"> {{t("sensor.lastMeasure")}} </p>
                </div>
    
                <div class="leftDiv lastConnectionLandscape">
                    <h1 :class="['marginless', 'lastMeasureCuantity']"> {{lastConnection_formatted}} </h1>
                    <p class="marginless"> {{t("connection.lastConnection")}} </p>
                </div>
    
                <div class="leftDiv">
                    <h1 :class="['marginless', 'lastMeasureCuantity', 'alert']"> {{data.minAlert}}% </h1>
                    <p class="marginless"> {{t("sensor.alert")}} </p>
                </div>
            </div>
            
            <div class="leftDiv lastConnectionPortrait">
                <h1 :class="['marginless', 'lastMeasureCuantity', 'timeMeasure']"> {{lastConnection_formatted}} </h1>
                <p class="marginless"> {{t("connection.lastConnection")}} </p>
            </div>
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

    .partDiv {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .rowContainer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .leftDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: auto;
        gap: 0px;

        min-width: 100px;
    }

    .lastMeasureCuantity {
        font-size: 60px;
    }

    .timeMeasure {
        font-size: 12dvw;
    }
    
    .notOk {
        color: var(--danger);
    }

    .Ok {
        color: var(--ok)
    }

    .alert {
        color: var(--alert);
    }

    .lastConnectionLandscape {
        display: none;

        @media (orientation: landscape) {
            display: block;
        }
    }

    .lastConnectionPortrait {
        display: none;

        @media (orientation: portrait) {
            margin-top: 20px;
            display: block;
        }
    }
</style>
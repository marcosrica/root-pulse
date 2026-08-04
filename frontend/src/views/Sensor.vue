<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import type { SensorInfo } from '@/Utilities/types/SensorInfo';
    import { onMounted, ref } from 'vue';
    import PageInput from '@/components/PageInput.vue';
    import Chart from '@/components/Chart.vue';
    import PageButton from '@/components/PageButton.vue';
    
    //Library for easy translation features
    const { t } = useI18n();

    const startDate = ref<string>("");
    const endDate = ref<string>("");

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

    //STRESS TEST
    // Generate stress‑test data: 360 points, one every 2 minutes over 12 hours
    const start = new Date('2026-08-03T08:00:00');
    const pointCount = 100;
    const intervalMinutes = 2; // every 2 minutes → 30 points per hour
    
    const dates: string[] = [];
    const measures: number[] = [];
    
    for (let i = 0; i < pointCount; i++) {
        // Timestamp: start + i * intervalMinutes
        const time = new Date(start.getTime() + i * intervalMinutes * 60 * 1000);
        dates.push(time.toISOString());
      
        // Value: a daily sinusoid (peak around midday, trough at night) + random noise
        const hours = time.getHours() + time.getMinutes() / 60; // fractional hour
        // Sine wave: period 24 hours, peak at 12:00, trough at 0:00
        const base = 50 + 40 * Math.sin((hours - 6) * Math.PI / 12); // 10–90
        const noise = (Math.random() - 0.5) * 15; // ±7.5%
        const raw = base + noise;
        // Clamp between 0 and 100, round to 1 decimal
        const clamped = Math.min(100, Math.max(0, Math.round(raw * 10) / 10));
        measures.push(clamped);
    }
    
    onMounted(() => {
        valueOk.value = data.lastMeasure > data.minAlert;
        lastConnection_formatted.value = formatTime();

        console.log(lastConnection_formatted.value)
    })
</script>

<template>
    <BasePage location="sensor">
    	<!-- Name of the sensor -->
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{data.alias != "" ? data.alias : data.name}} </h1>
        </BaseDiv>

        <!-- Basic info panel -->
        <BaseDiv class="partDiv headerDiv">
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

        <!-- Chart panel -->
        <BaseDiv class="headerDiv paddingless">
            <div class="graphHeader">
               	<h1 class="marginless headerText" style="margin-top: 10px;"> {{t("sensor.graph")}} </h1>
                <PageButton :iconOnly="true" icon="/icons/Filter.svg" v-on:click="() => {  }"></PageButton>
            </div>
        	<Chart
       			:xData="dates"
        		:yData="measures"
         	/>
        </BaseDiv>
    </BasePage>
</template>

<style scoped>
    .marginless {
        margin: 0px;
    }

    .paddingless {
    	padding: 0px;
    }
    
    .headerText {
        font-size: 40px;
        text-align: center;
    }

    .headerDiv {
        margin-bottom: 30px;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;
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
        width: 100%;
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

    .graphHeader {
        box-sizing: border-box;
        padding-left: 10px;
        padding-right: 10px;
        
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        
        align-items: center;
        
        gap: 20px;
    }
</style>
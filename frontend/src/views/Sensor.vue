<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import type { SensorInfo } from '@/Utilities/types/SensorInfo';
    import { onMounted, ref } from 'vue';
    import PageInput from '@/components/PageInput.vue';
    import Chart from '@/components/Chart.vue';
    import PageButton from '@/components/PageButton.vue';
    import apiClient from '@/Utilities/MakePetition';
    import { useRoute } from 'vue-router';
    import type { FullSensorInfo } from '@/Utilities/types/FullSensorInfo';
    
    //Library for easy translation features
    const { t } = useI18n();

    //ID of the sensor being inspected
    const sensorId = useRoute().query.id;

    //Start and end date of the data being fetched for the graph
    const startDate = ref<string>("");
    const endDate = ref<string>("");

    //Checking if the last measure of the sensor is below the minimun safe value
    const valueOk = ref<boolean>(true);
    //Formatted texts with times in natural language
    const lastConnection_formatted = ref<string>("");
    const wateringTime_formatted = ref<string>(""); 
    const wateringPeriod_formatted = ref<string>("");

    //Full data of the sensor being inspected
    let data = ref<FullSensorInfo>({
        name: "Sensor1",
        alias: "",
        last_measure: 55,
        min_alert: 30,
        lastConnection: new Date('August 3, 2026 04:28:00'),
        id: 0,
        watering_period: 100,
        watering_time: 100,
        max_value: 100
    });

    //Function that formats a time from Date class into natural language
    const formatTime = (): string => {  
        const diffMs = Date.now() - new Date(data.value.lastConnection).getTime();
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

    //Function that formats a time in seconds into hours, mintues and seconds
    const formatBottomTime = (time: number): string => {
        const hours = Math.floor(time / 3600);
        const minutes = Math.floor(time / 60) % 60;
        const seconds = time % 60;

        let index = "connection.";

        //First filter: hours
        if (hours != 0) {
            //Second filter: minutes
            if (minutes != 0) {
                if (seconds != 0) {
                    index += "hoursMinutesSeconds";
                }
                else {
                    index += "hoursAndMinutes";
                }
            }
            else {
                if (seconds != 0) {
                    index += "hoursAndSeconds";
                }
                else {
                    index += "justHours";
                }
            }
        }
        else {
            if (minutes != 0) {
                if (seconds != 0) {
                    index += "minutesAndSeconds";
                }
                else {
                    index += "justMinutes";
                }
            }
            else {
                index += "justSeconds";
            }
        }

        return t(index, {h:hours, m:minutes, s:seconds});
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
    //END OF STRESS TEST

    const getData = async () => {
        const response = await apiClient.post('/sensor/info', { id: sensorId });      
        data.value = response.data as FullSensorInfo;
        console.log(data.value);
        lastConnection_formatted.value = formatTime();
    }
    
    onMounted(async () => {
        await getData();
        
        valueOk.value = data.value.last_measure > data.value.min_alert;
        lastConnection_formatted.value = formatTime();
        
        wateringTime_formatted.value = formatBottomTime(data.value.watering_time);
        wateringPeriod_formatted.value = formatBottomTime(data.value.watering_period);
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
                    <h1 :class="['marginless', 'lastMeasureCuantity', valueOk ? 'Ok' : 'notOk']"> {{Math.floor((data.last_measure / data.max_value) * 100)}}% </h1>
                    <p class="marginless"> {{t("sensor.lastMeasure")}} </p>
                </div>
    
                <div class="leftDiv lastConnectionLandscape">
                    <h1 :class="['marginless', 'lastMeasureCuantity']"> {{lastConnection_formatted}} </h1>
                    <p class="marginless"> {{t("connection.lastConnection")}} </p>
                </div>
    
                <div class="leftDiv">
                    <h1 :class="['marginless', 'lastMeasureCuantity', 'alert']"> {{Math.floor((data.min_alert / data.max_value) * 100)}}% </h1>
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

        <!-- Watering schemes -->
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("sensor.wateringSchemes")}} </h1>

            <BaseDiv class="schemesDiv firstScheme">
                <div class="sensorDivArrow clock" />
                <p class="marginless timeText"> {{wateringPeriod_formatted}} </p>
                <div class="sensorDivArrow arrow" />
            </BaseDiv>

            <BaseDiv class="schemesDiv lastScheme">
                <div class="sensorDivArrow wateringCan"/>
                <p class="marginless timeText"> {{wateringTime_formatted}} </p>
                <div class="sensorDivArrow arrow" />
            </BaseDiv>
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
        display: flex;
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
        cursor: pointer;
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

    .sensorDivArrow {
        height: 20px;
        aspect-ratio: 1;
        background-color: var(--div-border);
        mask-size: contain;
    }

    .schemesDiv {
        box-sizing: border-box;
        width: 100%;
        max-width: 600px;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .firstScheme {
        margin-top: 15px;
        margin-bottom: 10px;
    }

    .lastScheme {
        margin-bottom: 5px;
    }
    
    .clock {
        mask-image: url('/icons/Clock.svg');
    }

    .arrow {
        mask-image: url('/icons/RightArrow.svg');
    }

    .wateringCan {
        mask-image: url('/icons/WateringCan.svg');
    }

    .timeText {
        font-size: 1dvw;

        @media(orientation: portrait) {
            font-size: 6dvw;

            @media(min-width: 550px) {
                font-size: 4dvw;
            }
        }
    }
</style>
<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import type { SensorInfo } from '@/Utilities/types/SensorInfo';
    
    //Library for easy translation features
    const { t } = useI18n();

    // Owned sensors
    // TODO: Create an API endpoint and connect to db
    let sensors: SensorInfo[] = [
        {name:"Sensor 1", alias: "", lastMeasure: 61, minAlert: 30, lastConnection: new Date('December 17, 2021 04:28:00')},
        {name:"Sensor 2", alias: "Alias 2", lastMeasure: 20, minAlert: 30, lastConnection: new Date(2021, 11, 17)},
        {name:"Sensor 3", alias: "Alias 3", lastMeasure: 90, minAlert: 30, lastConnection: new Date(2026, 12, 31)},
        {name:"Sensor 4", alias: "", lastMeasure: 80, minAlert: 30, lastConnection: new Date(2021, 11, 17, 4, 28, 0)},
    ]
</script>

<template>
    <BasePage location="home">
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("home.welcomeBack")}} </h1>
        </BaseDiv>

        <BaseDiv>
            <h1 class="marginless headerText sensorsText"> {{t("home.checkSensors")}} </h1>

            <BaseDiv v-for="sensor in sensors" class="sensorDiv">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText" v-if="sensor.alias != ''"> {{sensor.alias}} </p>
                    <p class="marginless sensorNameText" v-else> {{sensor.name}} </p>

                    <p :class="['marginless', 'sensorNameText', (sensor.lastMeasure <= sensor.minAlert) ? 'notOkText' : '']"> {{sensor.lastMeasure}}% </p>
                </div>
                <div class="sensorDivArrow">
                </div>
            </BaseDiv>

            <BaseDiv class="sensorDiv">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText"> {{t("home.checkAll")}} </p>
                </div>
                <div class="sensorDivArrow">
                </div>
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

    .rightArrow {
        background-color: var(--menu-icon-color);
        height: 90%;
        aspect-ratio: 1;

        mask-image: url('/icons/RightArrow.svg');
        mask-size: contain;
    }
    
    .sensorDivArrow {
        height: 20px;
        aspect-ratio: 1;
        background-color: var(--div-border);
        mask-image: url('/icons/RightArrow.svg');
        mask-size: contain;
    }
    
    .sensorsText {
        margin-bottom: 15px;
    }
    
    .sensorDiv {
        margin-bottom: 10px;
        cursor: pointer;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .sensorDivUsableSpace {
        height: auto;
        flex: 1;
        margin-right: 10px;
        color: var(--menu-icon-color);
        
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .notOkText {
        color: var(--btn-danger-active);
    }
    
    .sensorNameText {
        font-size: 25px;
    }
</style>
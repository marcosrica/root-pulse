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
    const newMin = ref<string>("0");
    
    let data: SensorInfo = {
        name: "Sensor1",
        alias: "",
        lastMeasure: 55,
        minAlert: 30,
        lastConnection: new Date('December 17, 2020 04:28:00')
    };

    onMounted(() => {
        valueOk.value = data.lastMeasure > data.minAlert;
        newMin.value = data.minAlert;
        
        let vl = Date.now() - data.lastConnection.getDate();
    })
</script>

<template>
    <BasePage location="home">
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{data.alias != "" ? data.alias : data.name}} </h1>
        </BaseDiv>

        <BaseDiv class="partDiv">
            <div class="leftDiv">
                <h1 :class="['marginless', 'lastMeasureCuantity', valueOk ? 'Ok' : 'notOk']"> {{data.lastMeasure}}% </h1>
                <p class="marginless"> {{t("sensor.lastMeasure")}} </p>
            </div>

            <div class="leftDiv">
                
            </div>

            <div class="leftDiv minAlertDiv">
                    <div class="minAlertIcon"></div>
                    <input type="number" class="minAlertInput" v-model="newMin" />
                    <h1 class="marginless headerText"> % </h1>
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
        flex-direction: row;
        justify-content: space-between;
    }

    .leftDiv {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
        width: auto;
        gap: 0px;
    }

    .lastMeasureCuantity {
        font-size: 60px;
    }

    .notOk {
        color: var(--danger);
    }

    .Ok {
        color: var(--ok)
    }

    .minAlertDiv {
        display: flex;
        flex-direction: row;
        width: auto;
        min-width: 200px;
    }

    .minAlertIcon {
        min-height: 50px;
        height: 100%;
        aspect-ratio: 1;
        background-color: var(--alert);
        mask-image: url('/icons/Alert.svg');
        mask-size: contain;
    }

    .minAlertInput {
        background-color: transparent;
        width:80px;
        height: 80%;
        border: 1px solid white;
        border-radius: 20px;
        color: white;
        font-size: 40px;
        display: flex;
    }
</style>
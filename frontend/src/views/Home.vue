<script setup lang="ts">
    import BasePage from '@/components/BasePage.vue';
    import BaseDiv from '@/components/BaseDiv.vue';
    import { useI18n } from '@/locales/i18n';
    import type { SensorInfo } from '@/Utilities/types/SensorInfo';
    import PageInput from '@/components/PageInput.vue';
    import { onMounted, ref } from 'vue';
    import PageButton from '@/components/PageButton.vue';
    import rightArrow from '@/../public/icons/RightArrow.svg';
    import apiClient, { api, ApiError } from '@/Utilities/MakePetition';
    
    //Library for easy translation features
    const { t } = useI18n();

    let showAddSensorLoading = ref<boolean>(false);
    let reloadSensorsWhenPossible = ref<boolean>(false);
    let newSensorName = ref<string>("");
    let newSensorPassword = ref<string>("");
    
    // Owned sensors
    // TODO: Create an API endpoint and connect to db
    let sensors = ref<SensorInfo[]>([
        { id:0, name: "Sensor1", alias: "", lastMeasure: 61, maxValue: 1024, minAlert: 30, lastConnection: new Date('December 17, 2021 04:28:00') },
        { id:0, name: "Sensor2", alias: "Alias 2", lastMeasure: 20, maxValue: 1024, minAlert: 30, lastConnection: new Date(2021, 11, 17) },
        { id:0, name: "Sensor3", alias: "Alias 3", lastMeasure: 90, maxValue: 1024, minAlert: 30, lastConnection: new Date(2026, 12, 31) },
        { id:0, name: "Sensor4", alias: "", lastMeasure: 80, maxValue: 1024, minAlert: 30, lastConnection: new Date(2021, 11, 17, 4, 28, 0) },
    ]);
    let bufferedSensors: SensorInfo[] | undefined = undefined;

    //Change to check a specific sensor
    const checkSensor = (sensorId:string) => {
        location.href = "/sensor?id=" + sensorId;
    }

    const getConnectedSensors = async (instant:boolean) => {
        //Calling the backend. UserId will be added in the token
        try {
            const result = await apiClient.get('/user/getConnectedSensors');
            
            if (result.status == 200) {
                let parsedResult:SensorInfo[] = result.data as SensorInfo[];

                for (let i = 0; i < parsedResult.length; i++) {
                    let sensor:SensorInfo|undefined = parsedResult[i];

                    if (sensor != undefined) {
                        let lastM:number = sensor.lastMeasure;
                        let minA: number = sensor.minAlert;
                      
                        sensor.lastMeasure = Math.floor((lastM / sensor.maxValue) * 100);
                        sensor.minAlert = Math.floor((minA / sensor.maxValue) * 100);
                    }
                }

                if (instant) {
                    sensors.value = parsedResult;
                }
                else {
                    if (showAddSensorLoading.value) {
                        bufferedSensors = parsedResult;
                    }
                    else {
                        bufferedSensors = undefined;
                        sensors.value = parsedResult;
                    }
                }
            }
        }
        catch (e) {
          console.error(e);
        }
    }

    const handleAddSensorCallback = () => {
        showAddSensorLoading.value = false;

        if (bufferedSensors != undefined) {
            sensors.value = bufferedSensors;
            bufferedSensors = undefined;
        }
    }
    
    //Add a new sensor with its name and password
    //Access granted this way will inmediately have the administrator role 
    const addSensor = async () => {
        //Getting beggining time of execution
        const date = Date.now();
        
        //Checking for non-null values on the form data
        if (newSensorName.value != "" && newSensorPassword.value != "") {
            //Sensor data is not null. Calling for backend
            //Setting the button as loading
            showAddSensorLoading.value = true; 
            
            //Formatting the data
            const data = { name: newSensorName.value, password: newSensorPassword.value };

            //Making the petition
            try {
                const response = await apiClient.post('/user/addSensor', data);

                if (response.status == 200) {
                    //Everything went fine. Reloading the sensors in the background
                    getConnectedSensors(false);

                    //removing the credentials, so that another one can be easily typed
                    newSensorName.value = "";
                    newSensorPassword.value = "";
                }
            }
            catch (error) {
                console.error("Failed to add sensor: ", error);
            }
            finally {
                //Checking how much time has passed since the beggining of the function
                const millisSpent = Date.now() - date;
                //Wait for half a second in the worst-case scenario before returning the button to its original state 
                setTimeout(handleAddSensorCallback, (500 - millisSpent));
            }
        }
    }

    onMounted(async () => {
        getConnectedSensors(true);
    })
</script>

<template>
    <BasePage location="home">
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("home.welcomeBack")}} </h1>
        </BaseDiv>

        <!-- Panel with avaiable sensors -->
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText sensorsText"> {{t("home.checkSensors")}} </h1>

            <!-- Individual panel of a specific sensor -->
            <BaseDiv v-for="sensor in sensors" class="sensorDiv" :click="() => { checkSensor(sensor.name) }">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText" v-if="sensor.alias != ''"> {{sensor.alias}} </p>
                    <p class="marginless sensorNameText" v-else> {{sensor.name}} </p>

                    <p :class="['marginless', 'sensorNameText', (sensor.lastMeasure <= sensor.minAlert) ? 'notOkText' : '']"> {{sensor.lastMeasure}}% </p>
                </div>
                <div class="sensorDivArrow">
                </div>
            </BaseDiv>

            <BaseDiv class="sensorDiv" v-if="sensors.length > 4">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText"> {{t("home.checkAll")}} </p>
                </div>
                <div class="sensorDivArrow">
                </div>
            </BaseDiv>
        </BaseDiv>

        <!-- Form for adding a new sensor -->
        <BaseDiv class="headerDiv addSensorDiv">
            <h1 class="marginless headerText sensorsText"> {{t("home.addPlant")}} </h1>

            <PageInput class="inputDiv" type="text" v-model:modelValue="newSensorName" :placeholder="t('home.sensorName')"/>
            <PageInput class="inputDiv" type="password" v-model:modelValue="newSensorPassword" :placeholder="t('home.sensorPassword')" />

            <PageButton class="inputDiv" variant="primary" :loading="showAddSensorLoading" rightIcon="/icons/RightArrow.svg" v-on:click="addSensor"> {{t("home.add")}} </PageButton>
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

    .addSensorDiv {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: center;
    }
    
    .inputDiv {
        margin-bottom: 10px;
        max-width: 700px;
    }
</style>
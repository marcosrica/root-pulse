<script setup lang="ts">
import BasePage from '@/components/BasePage.vue';
import BaseDiv from '@/components/BaseDiv.vue';
import type { userInfo } from '@/Utilities/types/UserInfo';
import type { SensorInfo } from '@/Utilities/types/SensorInfo';
import { useI18n } from '@/locales/i18n';
import ToggleBar from '@/components/ToggleBar.vue';
import { onMounted, ref } from 'vue';
import { useThemeStore } from '@/stores/theme'
import Dropdown from '@/components/Dropdown.vue';
import PageButton from '@/components/PageButton.vue';
import FloatingPanel from '@/components/FloatingPanel.vue';
import PageInput from '@/components/PageInput.vue';

const themeStore = useThemeStore();

//Library for easy translation features
const { t } = useI18n();
const { currentLocale, setLocale, availableLocales } = useI18n()

const currentTheme = ref('Home');
const currentLang = ref('English')
const showSensorInfoPanel = ref(false);
const sensorId = ref<number>(0);

const currentSensorAlias = ref<string>("");

let info: userInfo = {
  username: "TestUser",
  language: "en",
  theme: false,
  id: 1,
}

let sensors: SensorInfo[] = [
    {name:"Sensor 1", alias: "", lastMeasure: 61, minAlert: 30, lastConnection: new Date('December 17, 2021 04:28:00')},
    {name:"Sensor 2", alias: "Alias 2", lastMeasure: 20, minAlert: 30, lastConnection: new Date(2021, 11, 17)},
    {name:"Sensor 3", alias: "Alias 3", lastMeasure: 90, minAlert: 30, lastConnection: new Date(2026, 12, 31)},
    {name:"Sensor 4", alias: "", lastMeasure: 80, minAlert: 30, lastConnection: new Date(2021, 11, 17, 4, 28, 0)},
]

const changedTheme = () => {
    if (currentTheme.value == t("theme.dark")) {
        themeStore.setTheme('dark');
        info.theme = false;
    }
    else {
        themeStore.setTheme('light');
        info.theme = true;
    }
}

const setThemeBasedOnBoolean = () => {
    if (info.theme) {
        currentTheme.value = t('theme.light');
    }
    else {
        currentTheme.value = t('theme.dark');
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

    setThemeBasedOnBoolean();
}

const getVerboseLanguage = (lang: string) => {
    switch (lang) {
        case "en":
            return "English";

        case "es":
            return "Español";
    }
}

const inspectSensor = (sensorIndex: number) => {
    sensorId.value = sensorIndex;
    showSensorInfoPanel.value = true;
    currentSensorAlias.value = sensors[sensorIndex]?.alias || "";
  
    console.log(sensorIndex);
}

const aliasChanged = () => {
    if (currentSensorAlias.value == "") {
        currentSensorAlias.value = sensors[sensorId.value]?.alias || "";
    }
    else {
        //TODO: send alias to cloud
    }
}

onMounted(() => {
    setThemeBasedOnBoolean();

    currentLang.value = getVerboseLanguage(info.language) || "en";

    changedLanguage();
});
</script>

<template>
    <BasePage location="profile">
        <FloatingPanel :show="showSensorInfoPanel" :hide="() => { showSensorInfoPanel = false; }">
            <div class="inspectSensorContainer">
                <div class="inspectSensorHeader">
                    <h1 class="inspectSensorName" v-if="sensors[sensorId]?.alias != ''"> {{sensors[sensorId]?.alias}} </h1>
                    <h1 class="inspectSensorName" v-else> {{sensors[sensorId]?.name}} </h1>

                    <PageButton :iconOnly="true" icon="/icons/Cross.svg" v-on:click="() => { showSensorInfoPanel = false; }"></PageButton>
                </div>

                <div class="inspectSensorContentWrapper">
                    <BaseDiv class="inspectSensorBasicInfoWrapper">
                        <div class="inspectSensorRow"> 
                            <h1 class="marginless sensorNameText"> {{t("profile.name")}}: </h1>
                            <h1 class="marginless sensorNameText"> {{sensors[sensorId]?.name}} </h1>
                        </div>

                        <div class="inspectSensorRow"> 
                            <h1 class="marginless sensorNameText"> {{t("profile.alias")}}: </h1>
                            <PageInput :placeholder="sensors[sensorId]?.alias" v-model="currentSensorAlias" :changed="aliasChanged"></PageInput>
                        </div>
                    </BaseDiv>
                </div>
            </div>
        </FloatingPanel>
        
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

        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("profile.sensors")}} </h1>
            
            <BaseDiv v-for="(sensor, index) in sensors" class="innerDiv">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText" v-if="sensor.alias != ''"> {{sensor.alias}} </p>
                    <p class="marginless sensorNameText" v-else> {{sensor.name}} </p>
                </div>

                <div class="marginless sensorDivUsableSpace">
                    <PageButton :iconOnly="true" icon="/icons/Edit.svg" v-on:click="inspectSensor(index)" />
                    <PageButton variant="danger" :iconOnly="true" icon="/icons/Trash.svg" />
                </div>
            </BaseDiv>
        </BaseDiv>
    </BasePage>
</template>

<style scoped>
.row {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    gap: 10px;
}

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

.sensorNameText {
     font-size: 25px;
}

.sensorDivUsableSpace {
    height: auto;
    margin-right: 10px;
    color: var(--menu-icon-color);
    
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
}

.inspectSensorContainer {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;

    @media(orientation: portrait) {
        width: 95dvw;
    }
    @media(orientation: landscape) {
        min-width: 40dvw;
    }
}

.inspectSensorHeader {
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

.inspectSensorName {
    margin: 5px;
    font-size: 40px;
}

.inspectSensorContentWrapper {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
    max-height: 80dvh;

    overflow-y: auto;
}

.inspectSensorBasicInfoWrapper {
    box-sizing: border-box;
    width: 100%;
}

.inspectSensorRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 20px;
}
</style>
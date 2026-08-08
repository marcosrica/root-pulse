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
import type { connectedUsersInfo } from '@/Utilities/types/ConnectedUsersInfo';
import apiClient from '@/Utilities/MakePetition';

const themeStore = useThemeStore();

//Library for easy translation features
const { t } = useI18n();
const { currentLocale, setLocale, availableLocales } = useI18n()

const showUserInfoLoading = ref<boolean>(true);

const currentTheme = ref('Home');
const currentLang = ref('English')
const showSensorInfoPanel = ref(false);
let sensorId:number = -1;

const currentSensorAlias = ref<string>("");
const currentStatusWithSensor = ref<connectedUsersInfo>();
const searchedUsername = ref<string>("");

let info: userInfo = {
    username: "TestUser",
    language: "en",
    theme: false,
}

let sensors = ref<SensorInfo[]>([]);

let connections: connectedUsersInfo[] = [
  { userId: 2, username: "Manolo", userPermission: false },
  { userId: 3, username: "Carmen", userPermission: true },
  { userId: 4, username: "Lucía", userPermission: false },
  { userId: 2, username: "Manolo", userPermission: false },
  { userId: 3, username: "Carmen", userPermission: true },
  { userId: 4, username: "Lucía", userPermission: false },
  { userId: 2, username: "Manolo", userPermission: false },
  { userId: 3, username: "Carmen", userPermission: true },
  { userId: 4, username: "Lucía", userPermission: false },
  { userId: 2, username: "Manolo", userPermission: false },
  { userId: 3, username: "Carmen", userPermission: true },
  { userId: 4, username: "Lucía", userPermission: false },
];

let possibleUsersToAdd: userInfo[] = [
  { username: "Juan", language: "en", theme: false, id: 1 },
  { username: "Claudia", language: "en", theme: false, id: 1 },
  { username: "Manolo", language: "en", theme: false, id: 1 },
  { username: "Laura", language: "en", theme: false, id: 1 },
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

const getTheme = () => {
  info.theme = themeStore.currentTheme == "light";
}

const setThemeBasedOnBoolean = () => {
    if (info.theme) {
        currentTheme.value = t('theme.light');
    }
    else {
        currentTheme.value = t('theme.dark');
    }
}

const getConnectedSensors = async () => {
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

                sensors.value = parsedResult;
            }
        }
        catch (e) {
          console.error(e);
        }
    }

const getUserInfo = async () => {
    const response = await apiClient.get('/user/info');
    console.log(response);
    
    if (response.ok) {
      
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
    sensorId = sensorIndex;
    showSensorInfoPanel.value = true;
    currentSensorAlias.value = sensors.value[sensorIndex]?.alias || "";

    if (sensorIndex == 0) {
        currentStatusWithSensor.value = { userId: 1, username: "TestUser", userPermission: false };
    }
    else {
      currentStatusWithSensor.value = { userId: 1, username: "TestUser", userPermission: true };
    }
  
    console.log(sensorIndex);
}

const deleteSensor = async (sensorId: number) => {
    try {
        const response = await apiClient.delete('/user/deleteSensor?id=' + sensorId);

        if (response.status == 200) {
            getConnectedSensors();
        }
    }
    catch (e) {
        console.error(e);
    }
}

const aliasChanged = async () => {
    if (currentSensorAlias.value == "" && sensorId != -1) {
        if(sensors.value != undefined) { currentSensorAlias.value = sensors.value[sensorId]?.alias || ""; }
    }
    else {
        const sensor: SensorInfo|undefined = sensors.value[sensorId];

        if (sensor != undefined) {
            //Sending the alias to the backend, for it to be stored
            //Setting the petition's body
            const data = {sensor: sensors.value[sensorId]?.id, alias: currentSensorAlias.value}
            
            //Making the petition
            const response = await apiClient.post('/user/changeAlias', data);
            
          if (response.ok) {
                //Everything went fine. Changing the alias on the frontend
                sensor.alias = currentSensorAlias.value;
            }
          else {
                //An error ocurred. Returning to base state
                currentSensorAlias.value = sensor.alias;
            }
        }
    } 
}

onMounted(() => {
    getTheme();
    setThemeBasedOnBoolean();
    getUserInfo();
    getConnectedSensors();
    
    currentLang.value = getVerboseLanguage(info.language) || "en";

    changedLanguage();
});
</script>

<template>
    <BasePage location="profile">
        <!-- For updating sensor info -->
        <FloatingPanel :show="showSensorInfoPanel" :hide="() => { showSensorInfoPanel = false; }">
            <div class="inspectSensorContainer">
                <!-- Floating panel's header -->
                <div class="inspectSensorHeader">
                    <h1 class="inspectSensorName" v-if="sensors[sensorId]?.alias != ''"> {{sensors[sensorId]?.alias}} </h1>
                    <h1 class="inspectSensorName" v-else> {{sensors[sensorId]?.name}} </h1>

                    <PageButton :iconOnly="true" icon="/icons/Cross.svg" v-on:click="() => { showSensorInfoPanel = false; }"></PageButton>
                </div>

                <div class="inspectSensorContentWrapper">
                    <!-- Basic data and config -->
                    <BaseDiv class="inspectSensorBasicInfoWrapper notEndInspectSensorContainer">
                        <div class="inspectSensorRow notLastRow"> 
                            <h1 class="marginless sensorNameText"> {{t("profile.name")}}: </h1>
                            <h1 class="marginless sensorNameText"> {{sensors[sensorId]?.name}} </h1>
                        </div>

                        <div class="inspectSensorRow"> 
                            <h1 class="marginless sensorNameText"> {{t("profile.alias")}}: </h1>
                            <PageInput :placeholder="sensors[sensorId]?.alias" v-model="currentSensorAlias" @change="aliasChanged"></PageInput>
                        </div>
                    </BaseDiv>

                    <!-- User management -->
                    <BaseDiv class="inspectSensorBasicInfoWrapper notEndInspectSensorContainer">
                        <BaseDiv v-for="(user, index) in connections" class="innerDiv">
                            <div class="sensorDivUsableSpace">
                                <p class="marginless sensorNameText"> {{user.username}} </p>
                            </div>

                            <!-- For admin users -->
                            <div class="marginless sensorDivUsableSpace" v-if="currentStatusWithSensor?.userPermission">
                                <PageButton variant="danger" :iconOnly="true" v-if="!user.userPermission" icon="/icons/Trash.svg" />
                                
                                <PageButton :iconOnly="true" icon="/icons/Crown.svg" v-if="user.userPermission" variant="gold"></PageButton>
                                <PageButton :iconOnly="true" icon="/icons/UpArrow.svg" v-else></PageButton>
                            </div>
                            <!-- For non-admin -->
                            <div class="marginless sensorDivUsableSpace" v-else>
                                <PageButton :iconOnly="true" icon="/icons/Crown.svg" v-if="user.userPermission" variant="gold"></PageButton>
                            </div>
                        </BaseDiv>
                    </BaseDiv>

                    <!-- Add new users, only accesible for admins -->
                    <BaseDiv class="inspectSensorBasicInfoWrapper" v-if="currentStatusWithSensor?.userPermission">
                        <h1 class="marginless sensorNameText centered notLastRow"> {{t("profile.addUser")}} </h1>

                        <BaseDiv v-for="user in possibleUsersToAdd" class="sensorDiv">
                            <div class="sensorDivUsableSpace">
                                <p class="marginless sensorNameText"> {{user.username}} </p>
                            </div>
                            <div class="sensorDivArrow">
                            </div>
                        </BaseDiv>
                        
                        <PageInput class="notLastRow" :placeholder="t('profile.addUsername')" v-model="searchedUsername"></PageInput>
                    </BaseDiv>
                </div>
            </div>
        </FloatingPanel>

        <!-- Username -->
        <BaseDiv class="headerDiv header">
            <h1 class="marginless headerText"> {{info.username}} </h1>

            <PageButton :iconOnly="true" icon="/icons/Edit.svg" />
        </BaseDiv>

        <!-- Basic configurations -->
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

        <!-- Sensors' div -->
        <BaseDiv class="headerDiv">
            <h1 class="marginless headerText"> {{t("profile.sensors")}} </h1>
            
            <BaseDiv v-for="(sensor, index) in sensors" class="innerDiv">
                <div class="sensorDivUsableSpace">
                    <p class="marginless sensorNameText" v-if="sensor.alias != ''"> {{sensor.alias}} </p>
                    <p class="marginless sensorNameText" v-else> {{sensor.name}} </p>
                </div>

                <div class="marginless sensorDivUsableSpace">
                    <PageButton :iconOnly="true" icon="/icons/Edit.svg" v-on:click="inspectSensor(index)" />
                    <PageButton variant="danger" :iconOnly="true" icon="/icons/Trash.svg" v-on:click="deleteSensor(sensor.id)" />
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

.centered {
    text-align: center;
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
    scrollbar-width: none;
    ::-webkit-scrollbar {display: none;}
}

.notEndInspectSensorContainer {
    margin-bottom: 20px;
}

.inspectSensorBasicInfoWrapper {
    box-sizing: border-box;
    width: 100%;
}

.notLastRow {
    margin-bottom: 10px;
}

.inspectSensorRow {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    gap: 20px;
}

.sensorDiv {
    margin-bottom: 10px;
    cursor: pointer;

    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.sensorDivArrow {
    height: 20px;
    aspect-ratio: 1;
    background-color: var(--div-border);
    mask-image: url('/icons/RightArrow.svg');
    mask-size: contain;
}
</style>
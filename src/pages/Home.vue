<template>
    <div class="container">
        <div class="Camera">
            

        </div>
        <div class="sensor-wrapper">
            <div class="label">
                    <Rotate3d />
                    
                </div>
            <div class="sensor">
                <span>Accelerometer</span>
                    <p>{{ accelerometerData.x }}</p>
                    <p>{{ accelerometerData.y }}</p>
                    <p>{{ accelerometerData.z }}</p>
            </div>
            <div class="sensor">
                <span>Gyroscope</span>
                <p>{{ gyroscopeData.x }}</p>
                <p>{{ gyroscopeData.y }}</p>
                <p>{{ gyroscopeData.z }}</p>
            </div>  
        </div>
        <CameraPage />
    </div>

</template>


<script setup>
import { ref } from 'vue';
import { useConfigStore } from '../store/Config';
import { onMounted ,onUnmounted} from 'vue';
import { Rotate3d } from 'lucide-vue-next';
import { useDeviceMotion ,useDeviceOrientation} from '@vueuse/core'
import CameraPage from './CameraPage.vue';

const {
  acceleration,
  accelerationIncludingGravity,
  rotationRate,
  interval,
} = useDeviceMotion()
const {
  gamma
} = useDeviceOrientation();

const configStore = useConfigStore();
const accelerometerData = ref({ x: acceleration.value.x || 0, y: acceleration.value.y || 0 , z: acceleration.value.z || 0 });
const gyroscopeData = ref({ x: 0, y: 0, z: 0 });


</script>


<style>
.sensor-wrapper{
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin-top: 50px;
    width: 100%;
}

.sensor{

border:1px solid rgb(255, 255, 255);
}
.label{
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
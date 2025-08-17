<template>
  <div class="camera-page">
    <span>Camera Feed + Fixed GPS ROS Publisher</span>

    <div class="gps">
      <p><strong>Publishing fixed Latitude:</strong> {{ latitude }}</p>
      <p><strong>Publishing fixed Longitude:</strong> {{ longitude }}</p>
    </div>

    <div class="camera">
      <video ref="video" autoplay playsinline muted></video>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import  'https://cdn.jsdelivr.net/npm/roslib@1.4.1/build/roslib.min.js';
import { useConfigStore } from '../store/Config';

const video = ref(null);
const latitude = ref(null);
const longitude = ref(null);

let ros, cameraTopic, gpsTopic;
let cameraInterval, gpsInterval;
const permissions = [
  'camera',
  'geolocation',
  'top-level-storage-access',
];

async function processPermissions() {
  for (const permission of permissions) {
    const result = await getPermission(permission);
    console.log(result);
  }
}
async function getPermission(permission) {
  try {
    let result;
    if (permission === "top-level-storage-access") {
      result = await navigator.permissions.query({
        name: permission,
        requestedOrigin: window.location.origin,
      });
    } else {
      result = await navigator.permissions.query({ name: permission });
    }
    return `${permission}: ${result.state}`;
  } catch (error) {
    return `${permission} (not supported)`;
  }
}

onMounted(async () => {
  // Connect to rosbridge_server (change to your ROS IP/port)
  ros = new ROSLIB.Ros({
    url: `ws://${useConfigStore().ip}:${useConfigStore().port}` ,
  });

  ros.on('connection', () => console.log('Connected to rosbridge_server'));
  ros.on('error', (error) => console.error('ROS connection error:', error));
  ros.on('close', () => console.log('ROS connection closed'));

  // Setup ROS topics
  cameraTopic = new ROSLIB.Topic({
    ros,
    name: '/camera/image/compressed',
    messageType: 'sensor_msgs/CompressedImage',
  });

  gpsTopic = new ROSLIB.Topic({
    ros,
    name: '/gps/fix',
    messageType: 'sensor_msgs/NavSatFix',
  });

  // Access webcam


await processPermissions(

);

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (err) {
    console.error('Camera access denied:', err);
    alert('Camera access denied. Please allow camera access.');
    return;
  }

  // Prepare canvas to capture frames
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Publish camera frames every 500 ms
  cameraInterval = setInterval(() => {
    if (!video.value || video.value.readyState !== 4) return;

    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;

    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    cameraTopic.publish(
      new ROSLIB.Message({
        format: 'jpeg',
        data: base64Data,
      })
    );
  }, 500);

  // Publish fixed GPS coordinate every 1 second
  gpsInterval = setInterval(() => {
    navigator.geolocation.getCurrentPosition(function(location) {
  latitude.value = location.coords.latitude;
  longitude.value = location.coords.longitude;
  console.log(`Updated GPS: ${longitude.value}, ${latitude.value}`);
});
    gpsTopic.publish(
      new ROSLIB.Message({
        header: {
          stamp: { secs: Math.floor(Date.now() / 1000), nsecs: 0 },
          frame_id: 'gps',
        },
        status: { status: 0, service: 1 },
        latitude: latitude.value,
        longitude: longitude.value,
        altitude: 0,
        position_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
        position_covariance_type: 0,
      })
    );
  }, 1000);
});

onBeforeUnmount(() => {
  if (cameraInterval) clearInterval(cameraInterval);
  if (gpsInterval) clearInterval(gpsInterval);
  if (ros) ros.close();
});
</script>

<style scoped>
.camera-page {
  text-align: center;
}

.gps {
  margin-bottom: 20px;
  font-size: 18px;
}

.camera video {
  width: 100%;
  max-width: 640px;
  border: 2px solid black;
  border-radius: 8px;
}
</style>

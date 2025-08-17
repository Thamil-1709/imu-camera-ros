<template>
  <div>
    <h2>ROS Camera & GPS Publisher</h2>
    <video ref="video" autoplay playsinline muted></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ROSLIB from 'roslib';
import { useConfigStore } from '../store/Config';

const ip = useConfigStore().ip;
const port = useConfigStore().port;
const video = ref(null);
let ros, cameraTopic, gpsTopic;
let publishInterval;

onMounted(async () => {
  // Connect to rosbridge_server
  ros = new ROSLIB.Ros({
    url: `ws://${ip}:${port}`
  });

  ros.on('connection', () => console.log('Connected to rosbridge_server'));
  ros.on('error', (error) => console.error('ROS connection error:', error));
  ros.on('close', () => console.log('ROS connection closed'));

  // Setup topics
  cameraTopic = new ROSLIB.Topic({
    ros,
    name: '/camera/image/compressed',
    messageType: 'sensor_msgs/CompressedImage'
  });

  gpsTopic = new ROSLIB.Topic({
    ros,
    name: '/gps/fix',
    messageType: 'sensor_msgs/NavSatFix'
  });

  // Access webcam
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (err) {
    console.error('Camera access denied:', err);
    return;
  }

  // Canvas for capturing frames
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Publish frames every 500 ms
  publishInterval = setInterval(() => {
    if (!video.value || video.value.readyState !== 4) return;

    canvas.width = video.value.videoWidth;
    canvas.height = video.value.videoHeight;

    ctx.drawImage(video.value, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
    const base64Data = dataUrl.replace(/^data:image\/jpeg;base64,/, '');

    cameraTopic.publish(new ROSLIB.Message({
      format: 'jpeg',
      data: base64Data
    }));
  }, 500);

  //----- Publish GPS updates---------
  if ('geolocation' in navigator) {
    navigator.geolocation.watchPosition(
      (pos) => {
        gpsTopic.publish(new ROSLIB.Message({
          header: {
            stamp: { secs: Math.floor(pos.timestamp / 1000), nsecs: 0 },
            frame_id: 'gps',
          },
          status: { status: 0, service: 1 },
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          altitude: pos.coords.altitude || 0,
          position_covariance: [0, 0, 0, 0, 0, 0, 0, 0, 0],
          position_covariance_type: 0,
        }));
      },
      (err) => console.error('GPS error:', err),
      { enableHighAccuracy: true }
    );
  } else {
    console.warn('Geolocation not supported');
  }
});

onBeforeUnmount(() => {
  if (publishInterval) clearInterval(publishInterval);
  if (ros) ros.close();
});
</script>

<style scoped>
video {
  width: 100%;
  max-width: 640px;
  border: 2px solid #000;
  border-radius: 8px;
}
</style>

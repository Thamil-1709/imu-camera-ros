<template>
  <div>
    <h2>Live Camera Feed</h2>
    <video ref="video" autoplay playsinline></video>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const video = ref(null);

onMounted(async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.value.srcObject = stream;
  } catch (err) {
    console.error('Camera access denied or not available:', err);
  }
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

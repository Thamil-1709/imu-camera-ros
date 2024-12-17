<script setup>
import { ref } from 'vue'

import { Bolt,House } from 'lucide-vue-next';
import { RouterLink } from 'vue-router';

defineProps({
  msg: String,
})

const count = ref(0)
</script>

<template>
  <nav>
    <RouterLink to="/">
      <House  />
    </RouterLink>
    <RouterLink to="/settings">
      <Bolt />
    </RouterLink>
  </nav>
</template>

<style scoped>
nav {
  display: flex;
  position: sticky;
  bottom: 0;
  justify-content: space-between;
  padding: 1rem;
  background-color: #ffffff;
  color: rgb(14, 13, 13);
  border-bottom: rgba(134, 134, 134, 0.2) 1px solid;
}
</style>

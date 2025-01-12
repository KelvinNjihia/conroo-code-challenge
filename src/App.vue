<script setup lang="ts">
import TimeSlots from './components/timeSlots/TimeSlots.vue';
</script>

<template>
  <nav class="navbar has-background-primary">
    <div class="navbar-brand">
      <div class="navbar-item is-size-2 has-text-weight-bold has-text-white">Time Slots</div>
    </div>
  </nav>
  <main class="container py-5">
    <TimeSlots />
  </main>
</template>
<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>

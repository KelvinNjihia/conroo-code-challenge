<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useTimeSlotsStore } from '@/stores/TimeSlotStore';

const timeSlotsStore = useTimeSlotsStore();
// Use computed to get the timeSlots from the store
const timeSlots = computed(() => timeSlotsStore.getTimeSlots);

// Get unique times for rows with ranges
const uniqueTimes = computed(() => {
  const allTimes = timeSlots.value.map((slot) => {
    const options: Intl.DateTimeFormatOptions = {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    };

    const start = new Date(slot.start_time);
    const end = new Date(slot.end_time);
    return {
      display: `${start.toLocaleTimeString('en-US', options)} - ${end.toLocaleTimeString('en-US', options)}`,
      sortTime: start.getTime()
    };
  });

  // Create unique set
  const uniqueTimeStrings = [...new Set(allTimes.map((t) => t.display))];

  return uniqueTimeStrings.sort((a, b) => {
    const timeA = new Date(`1970/01/01 ${a.split(' - ')[0]}`).getTime();
    const timeB = new Date(`1970/01/01 ${b.split(' - ')[0]}`).getTime();
    return timeA - timeB;
  });
});

// Get unique dates for columns
const uniqueDates = computed(() => {
  return [
    ...new Set(
      timeSlots.value.map((slot) => {
        const date = new Date(slot.start_time);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric'
        });
      })
    )
  ].sort((a, b) => {
    return new Date(a).getTime() - new Date(b).getTime();
  });
});

// Helper function to find slot for a specific date and time
const findSlot = (date: string, timeRange: string) => {
  const [startTime] = timeRange.split(' - ');
  return timeSlots.value.find((slot) => {
    const slotDate = new Date(slot.start_time).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC'
    });
    const slotTime = new Date(slot.start_time).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC'
    });
    return slotDate === date && slotTime === startTime;
  });
};

onMounted(async () => {
  // fetch the timeSlots from the store
  await timeSlotsStore.fetchTimeSlots();
  // start listening to the event stream
  timeSlotsStore.initializeTimeSlotsEventStream();
});
</script>

<template>
  <div class="section">
    <div class="title is-size-3 has-text-link-dark mb-3">
      Get realtime updates of the time slots
    </div>
    <div class="grid-container">
      <!-- Header row -->
      <div class="p-2 is-size-5 has-text-weight-bold header-cell has-background-grey">Time</div>
      <div
        v-for="date in uniqueDates"
        :key="date"
        class="p-2 is-size-5 has-text-weight-bold header-cell has-text-centered has-background-grey"
      >
        {{ date }}
      </div>

      <!-- Time slots -->
      <template v-for="time in uniqueTimes" :key="time">
        <div
          class="has-background-grey-light has-text-centered has-text-weight-bold p-2 grid-cell-time"
        >
          {{ time }}
        </div>
        <div
          v-for="date in uniqueDates"
          :key="`${date}-${time}`"
          class="grid-cell has-background-grey-lighter"
          :class="findSlot(date, time)?.category"
        >
          <!-- id -->
          <p class="is-size-6 has-text-weight-bold">
            Slot ID: {{ findSlot(date, time)?.id }}

            <!-- capacity -->
            {{ findSlot(date, time)?.capacity.current_capacity }}/{{
              findSlot(date, time)?.capacity.max_capacity
            }}
          </p>

          <progress
            class="progress"
            :class="findSlot(date, time)?.category"
            :value="findSlot(date, time)?.capacity.current_capacity"
            :max="findSlot(date, time)?.capacity.max_capacity"
          >
            {{ findSlot(date, time)?.capacity.current_capacity }}/{{
              findSlot(date, time)?.capacity.max_capacity
            }}
          </progress>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.section {
  padding: 16px;
  background-color: var(--conroo-secondary-background);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.grid-container {
  display: grid;
  grid-template-columns: auto repeat(5, 1fr);
  gap: 8px;
  padding: 16px;
}

.header-cell {
  color: var(--conroo-text-color-black);
  border-radius: 4px;
}

.grid-cell {
  padding: 12px;
  border: 1px solid #eee;
  border-radius: 4px;
  text-align: center;
}

.grid-cell-time {
  border-radius: 4px;
}

.green {
  color: green;
}
.yellow {
  color: yellow;
}
.red {
  color: red;
}

.green progress {
  background-color: var(--progress-bg-green);
}
.green progress::-webkit-progress-value {
  background-color: var(--status-green);
}
.green progress::-moz-progress-bar {
  background-color: var(--status-green);
}

.yellow progress {
  background-color: var(--progress-bg-yellow);
}
.yellow progress::-webkit-progress-value {
  background-color: var(--status-yellow);
}
.yellow progress::-moz-progress-bar {
  background-color: var(--status-yellow);
}

.red progress {
  background-color: var(--progress-bg-red);
}
.red progress::-webkit-progress-value {
  background-color: var(--status-red);
}
.red progress::-moz-progress-bar {
  background-color: var(--status-red);
}

progress {
  transition: all 0.3s ease;
  height: 12px;
  border-radius: 6px;
  overflow: hidden;
}
</style>

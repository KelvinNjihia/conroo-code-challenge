import { defineStore } from 'pinia';
import type { TimeSlot, TimeSlotEvent } from '../types/TimeSlotTypes';

//Added the url statically for now. In a real world scenario, this would be dynamically set based on the environment.
const baseApiUrl = 'https://timeslot-stream-ha2tva3niq-ey.a.run.app/';

export const useTimeSlotsStore = defineStore('timeSlots', {
  state: () => ({
    timeSlots: [] as TimeSlot[]
  }),

  getters: {
    getTimeSlots: (state) => state.timeSlots
  },

  actions: {
    async fetchTimeSlots() {
      try {
        const response = await fetch(`${baseApiUrl}/timeSlots`);
        this.timeSlots = await response.json();
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    initializeTimeSlotsEventStream() {
      try {
        const eventSource = new EventSource(`${baseApiUrl}/sse`);
        eventSource.onmessage = (event) => {
          const eventData: TimeSlotEvent = JSON.parse(event.data);
          this.updateTimeSlots(eventData);
        };
      } catch (error) {
        console.error(error);
        throw error;
      }
    },

    updateTimeSlots(newTimeSlot: TimeSlotEvent) {
      this.timeSlots = this.timeSlots.map((slot: TimeSlot) =>
        slot.id === newTimeSlot.id
          ? {
              ...slot,
              category: newTimeSlot.category,
              capacity: {
                ...slot.capacity,
                current_capacity: newTimeSlot.currentCapacity
              }
            }
          : slot
      );
    }
  }
});

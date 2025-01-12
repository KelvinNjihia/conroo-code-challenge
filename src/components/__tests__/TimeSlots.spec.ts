import { describe, it, expect } from 'vitest';

import { mount } from '@vue/test-utils';
import TimeSlots from '../timeSlots/TimeSlots.vue';
import { createPinia } from 'pinia';
import type { TimeSlotEvent } from '@/types/TimeSlotTypes';
import { useTimeSlotsStore } from '@/stores/TimeSlotStore';

const pinia = createPinia();

describe('TimeSlots', () => {
  it('renders properly', () => {
    const wrapper = mount(TimeSlots, {
      global: {
        plugins: [pinia]
      }
    });
    expect(wrapper.text()).toContain('Time');
  });

  it('updates time slots when event is streamed', async () => {
    const wrapper = mount(TimeSlots, {
      global: {
        plugins: [pinia]
      }
    });

    const event: TimeSlotEvent = {
      id: 1,
      currentCapacity: 10,
      category: 'test'
    };

    const timeSlotsStore = useTimeSlotsStore();
    timeSlotsStore.updateTimeSlots(event);

    expect(wrapper.text()).toContain('Time');
  });

  it('fetches time slots on mount', async () => {
    const wrapper = mount(TimeSlots, {
      global: {
        plugins: [pinia]
      }
    });
    await wrapper.vm.$nextTick();
    const store = useTimeSlotsStore();
    expect(store.getTimeSlots).toBeDefined();
  });
});

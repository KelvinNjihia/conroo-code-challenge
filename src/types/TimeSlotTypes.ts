export interface TimeSlot {
  id: number;
  start_time: string;
  end_time: string;
  category: string;
  capacity: {
    current_capacity: number;
    max_capacity: number;
  };
}

export type TimeSlotEvent = {
  id: number;
  currentCapacity: number;
  category: string;
};

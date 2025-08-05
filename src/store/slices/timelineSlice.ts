import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { add, sub, startOfDay, startOfHour } from 'date-fns';

interface TimelineState {
  windowStart: string;
  windowEnd: string;
  selectedStart: string;
  selectedEnd: string;
}

const today = startOfDay(new Date());
const initialState: TimelineState = {
  windowStart: sub(today, { days: 15 }).toISOString(),
  windowEnd: add(today, { days: 15 }).toISOString(),
  selectedStart: startOfHour(new Date()).toISOString(),
  selectedEnd: startOfHour(new Date()).toISOString(),
};

const timelineSlice = createSlice({
  name: 'timeline',
  initialState,
  reducers: {
    /**
     * Action to update the selected time range from the slider.
     */
    setTimeRange: (state, action: PayloadAction<{ start: string; end: string }>) => {
      state.selectedStart = action.payload.start;
      state.selectedEnd = action.payload.end;
    },
  },
});

export const { setTimeRange } = timelineSlice.actions;

export default timelineSlice.reducer;
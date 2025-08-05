
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Defines the shape of the map-related state.
interface MapState {
  isDrawing: boolean; 
  selectedPolygonId: string | null; 
}

const initialState: MapState = {
  isDrawing: false,
  selectedPolygonId: null,
};

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    /**
     * Toggles the drawing mode on and off.
     * If a payload with a boolean is provided, it sets the state directly.
     */
    toggleDrawing: (state, action: PayloadAction<boolean | undefined>) => {
      state.isDrawing = action.payload !== undefined ? action.payload : !state.isDrawing;
    },
    /**
     * Sets the currently selected polygon ID.
     * This is used to link the sidebar controls to a specific polygon on the map.
     */
    setSelectedPolygon: (state, action: PayloadAction<string | null>) => {
        state.selectedPolygonId = action.payload;
    }
  },
});

export const { toggleDrawing, setSelectedPolygon } = mapSlice.actions;
export default mapSlice.reducer;
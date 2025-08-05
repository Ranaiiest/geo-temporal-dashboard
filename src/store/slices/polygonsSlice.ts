
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PolygonData, ColorRule } from '../../types';
import { fetchTemperatureData } from '../../api/openMeteo';
import { RootState } from '../store';

interface PolygonsState {
  polygons: PolygonData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: PolygonsState = {
  polygons: [],
  status: 'idle',
};

const applyColorRules = (value: number, rules: ColorRule[]): string => {
    for (const rule of rules) {
        let conditionMet = false;
        switch (rule.operator) {
            case '>':  if (value > rule.value) conditionMet = true; break;
            case '<':  if (value < rule.value) conditionMet = true; break;
            case '=':  if (value === rule.value) conditionMet = true; break;
            case '>=': if (value >= rule.value) conditionMet = true; break;
            case '<=': if (value <= rule.value) conditionMet = true; break;
            default: break;
        }
        if (conditionMet) {
            return rule.color;
        }
    }
    return '#808080';
};

export const fetchPolygonData = createAsyncThunk(
  'polygons/fetchData',
  async (polygonId: string, { getState }) => {
    const state = getState() as RootState;
    const polygon = state.polygons.polygons.find(p => p.id === polygonId);
    const { selectedStart, selectedEnd } = state.timeline;

    if (!polygon) {
      throw new Error('Polygon not found');
    }

    const centerLat = polygon.points.reduce((sum, p) => sum + p[0], 0) / polygon.points.length;
    const centerLng = polygon.points.reduce((sum, p) => sum + p[1], 0) / polygon.points.length;

    const data = await fetchTemperatureData(centerLat, centerLng, selectedStart, selectedEnd);
    
    
    if (data === null) {
        return { polygonId, value: undefined, color: '#4a4a4a' };
    }

    
    const validData = data.filter((temp): temp is number => temp !== null);

    if (validData.length === 0) {
        return { polygonId, value: undefined, color: '#4a4a4a' };
    }
    
    const averageValue = validData.reduce((sum, val) => sum + val, 0) / validData.length;
    const color = applyColorRules(averageValue, polygon.rules);

    return { polygonId, value: averageValue, color };
  }
);

const polygonsSlice = createSlice({
  name: 'polygons',
  initialState,
  reducers: {
    addPolygon: (state, action: PayloadAction<PolygonData>) => {
      state.polygons.push(action.payload);
    },
    removePolygon: (state, action: PayloadAction<string>) => {
        state.polygons = state.polygons.filter(p => p.id !== action.payload);
    },
    updatePolygonRules: (state, action: PayloadAction<{ polygonId: string; rules: ColorRule[] }>) => {
        const polygon = state.polygons.find(p => p.id === action.payload.polygonId);
        if (polygon) {
            polygon.rules = action.payload.rules;
            if (polygon.currentValue !== undefined) {
                polygon.color = applyColorRules(polygon.currentValue, polygon.rules);
            }
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPolygonData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPolygonData.fulfilled, (state, action) => {
        const { polygonId, value, color } = action.payload;
        const polygon = state.polygons.find(p => p.id === polygonId);
        if (polygon) {
          polygon.currentValue = value;
          polygon.color = color;
        }
        state.status = 'succeeded';
      })
      .addCase(fetchPolygonData.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { addPolygon, removePolygon, updatePolygonRules } = polygonsSlice.actions;
export default polygonsSlice.reducer;
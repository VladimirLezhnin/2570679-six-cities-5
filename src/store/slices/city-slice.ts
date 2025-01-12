import { createSlice } from '@reduxjs/toolkit';
import { changeCity } from '../action';

interface CityState {
  name: string;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
}

const initialState: CityState = {
  name: 'Paris',
  location: {
    latitude: 48.85661,
    longitude: 2.351499,
    zoom: 13,
  },
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(changeCity, (state, action) => {
        state.name = action.payload.name;
        state.location = action.payload.location;
      });
  },
});

export default citySlice.reducer;

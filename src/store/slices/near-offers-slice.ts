import { createSlice } from '@reduxjs/toolkit';
import { fetchNearOffers } from '../../api/api-actions';
import { Offer } from '../../types';

export interface NearOffersState {
  nearOffers: Offer[];
}

const initialState: NearOffersState = {
  nearOffers: [],
};

const nearOffersSlice = createSlice({
  name: 'nearOffers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearOffers.fulfilled, (state, action) => {
        state.nearOffers = action.payload;
      });
  },
});

export default nearOffersSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferDetails } from '../api/api-actions';
import { OfferDetails } from '../types';

interface OfferDetailsState {
  offerDetails: OfferDetails | undefined;
}

const initialState: OfferDetailsState = {
  offerDetails: undefined,
};

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOfferDetails.fulfilled, (state, action) => {
      state.offerDetails = action.payload;
    });
  },
});

export default offerDetailsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferDetails } from '../../api/api-actions';
import { setOfferDetails } from '../action';
import { OfferDetails } from '../../types';

export interface OfferDetailsState {
  offerDetails: OfferDetails | undefined;
  isLoading: boolean;
}

const initialState: OfferDetailsState = {
  offerDetails: undefined,
  isLoading: false
};

const offerDetailsSlice = createSlice({
  name: 'offerDetails',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchOfferDetails.fulfilled, (state, action) => {
        state.offerDetails = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchOfferDetails.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(setOfferDetails, (state, action) => {
        state.offerDetails = action.payload;
      });
  },
});

export default offerDetailsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { changeOffersSortingOption } from '../action';
import { fetchOffers } from '../../api/api-actions';
import { Offer } from '../../types';
import { SortingOption } from '../../enums';

export interface OffersState {
  offers: Offer[];
  isOffersDataLoading: boolean;
  offersSortingOption: SortingOption;
}

const initialState: OffersState = {
  offers: [],
  isOffersDataLoading: false,
  offersSortingOption: SortingOption.Popular
};

const offersSlice = createSlice({
  name: 'offers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOffers.rejected, (state) => {
        state.isOffersDataLoading = false;
      })
      .addCase(fetchOffers.pending, (state) => {
        state.isOffersDataLoading = true;
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
        state.isOffersDataLoading = false;
      })
      .addCase(changeOffersSortingOption, (state, action) => {
        state.offersSortingOption = action.payload;
      });
  },
});

export default offersSlice.reducer;

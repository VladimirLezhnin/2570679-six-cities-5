import { createSlice } from '@reduxjs/toolkit';
import { changeOffersSortingOption, setOffersLoadingStatus } from './action';
import { fetchOffers } from '../api/api-actions';
import { Offer } from '../types';
import { SortingOption } from '../enums';

export interface OffersState {
  offers: Offer[];
  isOffersDataLoading: boolean;
  offersSortingOption: SortingOption;
};

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
      .addCase(fetchOffers.fulfilled, (state, action) => {
        state.offers = action.payload;
      })
      .addCase(setOffersLoadingStatus, (state, action) => {
        state.isOffersDataLoading = action.payload;
      })
      .addCase(changeOffersSortingOption, (state, action) => {
        state.offersSortingOption = action.payload;
      });
  },
});

export default offersSlice.reducer;

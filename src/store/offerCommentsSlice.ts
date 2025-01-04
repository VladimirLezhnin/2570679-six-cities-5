import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferComments } from '../api/api-actions';
import { Review } from '../types';

interface OfferCommentsState {
  offerComments: Review[];
}

const initialState: OfferCommentsState = {
  offerComments: [],
};

const offerCommentsSlice = createSlice({
  name: 'offerComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchOfferComments.fulfilled, (state, action) => {
      state.offerComments = action.payload;
    });
  },
});

export default offerCommentsSlice.reducer;

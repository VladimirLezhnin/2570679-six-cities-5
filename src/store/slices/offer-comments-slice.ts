import { createSlice } from '@reduxjs/toolkit';
import { fetchOfferComments, sendComment } from '../../api/api-actions';
import { Review } from '../../types';

export interface OfferCommentsState {
  offerComments: Review[];
  commentSendingStatus: boolean;
}

const initialState: OfferCommentsState = {
  offerComments: [],
  commentSendingStatus: false
};

const offerCommentsSlice = createSlice({
  name: 'offerComments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOfferComments.fulfilled, (state, action) => {
        state.offerComments = action.payload;
      })
      .addCase(sendComment.pending, (state) => {
        state.commentSendingStatus = true;
      })
      .addCase(sendComment.rejected, (state) => {
        state.commentSendingStatus = false;
      })
      .addCase(sendComment.fulfilled, (state, action) => {
        state.offerComments.push(action.payload);
        state.commentSendingStatus = false;
      });
  },
});

export default offerCommentsSlice.reducer;

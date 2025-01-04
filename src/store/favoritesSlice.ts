import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Offer } from '../types';
import { addOfferToFavorites, removeOfferFromFavorites, fetchFavoriteOffers } from '../api/api-actions';

interface FavoritesState {
  favoriteOffers: Offer[];
}

const initialState: FavoritesState = {
  favoriteOffers: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addOfferToFavorites.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.favoriteOffers.push(action.payload);
      })
      .addCase(removeOfferFromFavorites.fulfilled, (state, action: PayloadAction<Offer>) => {
        state.favoriteOffers = state.favoriteOffers.filter(
          (offer) => offer.id !== action.payload.id
        );
      })
      .addCase(fetchFavoriteOffers.fulfilled, (state, action: PayloadAction<Offer[]>) => {
        state.favoriteOffers = action.payload;
      });
  },
});

export default favoritesSlice.reducer;

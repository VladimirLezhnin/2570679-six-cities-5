import favoritesReducer, { FavoritesState } from './favorites-slice';
import { addOfferToFavorites, removeOfferFromFavorites, fetchFavoriteOffers } from '../../api/api-actions';
import { Offer } from '../../types';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';

describe('favoritesSlice', () => {
  const initialState: FavoritesState = {
    favoriteOffers: [],
  };

  it('should return the initial state', () => {
    expect(favoritesReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle addOfferToFavorites.fulfilled', () => {
    const newFavorite: Offer = getFakeOffers()[0];
    const action = { type: addOfferToFavorites.fulfilled.type, payload: newFavorite };
    const state = favoritesReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      favoriteOffers: [newFavorite],
    });
  });

  it('should handle removeOfferFromFavorites.fulfilled', () => {
    const existingFavorite: Offer = getFakeOffers()[0];
    const populatedState: FavoritesState = {
      favoriteOffers: [existingFavorite],
    };
    const action = { type: removeOfferFromFavorites.fulfilled.type, payload: existingFavorite };
    const state = favoritesReducer(populatedState, action);

    expect(state).toEqual({
      ...populatedState,
      favoriteOffers: [],
    });
  });

  it('should handle fetchFavoriteOffers.fulfilled', () => {
    const mockFavoriteOffers: Offer[] = getFakeOffers();
    const action = { type: fetchFavoriteOffers.fulfilled.type, payload: mockFavoriteOffers };
    const state = favoritesReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      favoriteOffers: mockFavoriteOffers,
    });
  });
});

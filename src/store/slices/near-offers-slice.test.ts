import nearOffersReducer, { NearOffersState } from './near-offers-slice';
import { fetchNearOffers } from '../../api/api-actions';
import { Offer } from '../../types';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';

describe('nearOffersSlice', () => {
  const initialState: NearOffersState = {
    nearOffers: [],
  };

  it('should return the initial state', () => {
    expect(nearOffersReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle fetchNearOffers.fulfilled', () => {
    const mockNearOffers: Offer[] = getFakeOffers();
    const action = { type: fetchNearOffers.fulfilled.type, payload: mockNearOffers };
    const state = nearOffersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      nearOffers: mockNearOffers,
    });
  });
});

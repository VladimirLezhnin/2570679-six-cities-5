import offersReducer, { OffersState } from './offers-slice';
import { fetchOffers } from '../../api/api-actions';
import { changeOffersSortingOption } from '../action';
import { SortingOptionName } from '../../enums';
import { getFakeOffers } from '../../utils/mock/get-fake-offers';


describe('offersSlice', () => {
  const initialState: OffersState = {
    offers: [],
    isOffersDataLoading: false,
    offersSortingOption: SortingOptionName.Popular,
  };

  it('should return the initial state', () => {
    expect(offersReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle fetchOffers.pending', () => {
    const action = { type: fetchOffers.pending.type };
    const state = offersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isOffersDataLoading: true,
    });
  });

  it('should handle fetchOffers.fulfilled', () => {
    const mockOffers = getFakeOffers();
    const action = { type: fetchOffers.fulfilled.type, payload: mockOffers };
    const state = offersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      offers: mockOffers,
      isOffersDataLoading: false,
    });
  });

  it('should handle fetchOffers.rejected', () => {
    const action = { type: fetchOffers.rejected.type };
    const state = offersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isOffersDataLoading: false,
    });
  });

  it('should handle changeOffersSortingOption', () => {
    const newSortingOption = SortingOptionName.PriceLowToHigh;
    const action = { type: changeOffersSortingOption.type, payload: newSortingOption };
    const state = offersReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      offersSortingOption: newSortingOption,
    });
  });
});

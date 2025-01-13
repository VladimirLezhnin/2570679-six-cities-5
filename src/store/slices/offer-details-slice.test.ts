import offerDetailsReducer, { OfferDetailsState } from './offer-details-slice';
import { fetchOfferDetails } from '../../api/api-actions';
import { setOfferDetails } from '../action';
import { OfferDetails } from '../../types';
import { getFakeOfferDetails } from '../../utils/mock/get-fake-offer-details';


describe('offerDetailsSlice', () => {
  const initialState: OfferDetailsState = {
    offerDetails: undefined,
    isLoading: false,
  };

  it('should return the initial state', () => {
    expect(offerDetailsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle fetchOfferDetails.pending', () => {
    const action = { type: fetchOfferDetails.pending.type };
    const state = offerDetailsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      isLoading: true,
    });
  });

  it('should handle fetchOfferDetails.fulfilled', () => {
    const mockOfferDetails: OfferDetails = getFakeOfferDetails();
    const action = { type: fetchOfferDetails.fulfilled.type, payload: mockOfferDetails };
    const state = offerDetailsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      offerDetails: mockOfferDetails,
      isLoading: false,
    });
  });

  it('should handle fetchOfferDetails.rejected', () => {
    const action = { type: fetchOfferDetails.rejected.type };
    const state = offerDetailsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
    });
  });

  it('should handle setOfferDetails', () => {
    const mockOfferDetails: OfferDetails = getFakeOfferDetails();
    const action = { type: setOfferDetails.type, payload: mockOfferDetails };
    const state = offerDetailsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      offerDetails: mockOfferDetails,
    });
  });
});

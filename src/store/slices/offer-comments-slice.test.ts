import offerCommentsReducer, { OfferCommentsState } from './offer-comments-slice';
import { fetchOfferComments, sendComment } from '../../api/api-actions';
import { Review } from '../../types';
import { getFakeReviews } from '../../utils/mock/get-fake-reviews';

describe('offerCommentsSlice', () => {
  const initialState: OfferCommentsState = {
    offerComments: [],
    commentSendingStatus: false,
  };

  it('should return the initial state', () => {
    expect(offerCommentsReducer(undefined, { type: undefined })).toEqual(initialState);
  });

  it('should handle fetchOfferComments.fulfilled', () => {
    const mockReviews: Review[] = getFakeReviews();
    const action = { type: fetchOfferComments.fulfilled.type, payload: mockReviews };
    const state = offerCommentsReducer(initialState, action);
    
    expect(state).toEqual({
      ...initialState,
      offerComments: mockReviews,
    });
  });

  it('should handle sendComment.pending', () => {
    const action = { type: sendComment.pending.type };
    const state = offerCommentsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      commentSendingStatus: true,
    });
  });

  it('should handle sendComment.fulfilled', () => {
    const newReview: Review = {
      id: 'new-review-id',
      user: {
        avatarUrl: 'https://example.com/avatar.jpg',
        isPro: false,
        name: 'Jane Doe',
      },
      rating: 5,
      comment: 'Excellent place!',
      date: '2025-01-04T02:07:25.791Z',
    };
    const action = { type: sendComment.fulfilled.type, payload: newReview };
    const state = offerCommentsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      offerComments: [newReview],
      commentSendingStatus: false,
    });
  });

  it('should handle sendComment.rejected', () => {
    const action = { type: sendComment.rejected.type };
    const state = offerCommentsReducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      commentSendingStatus: false,
    });
  });
});

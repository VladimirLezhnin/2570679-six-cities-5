import React, { useState } from 'react';
import { sendComment } from '../../../api/api-actions';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { selectOfferId, selectReviewSendingStatus } from '../../../store/selectors';


function ReviewForm() {
  const dispatch = useAppDispatch();
  const offerId = useAppSelector(selectOfferId);
  const reviewSendingStatus = useAppSelector(selectReviewSendingStatus);

  const [rating, setRating] = useState('');
  const [review, setReview] = useState('');

  if (!offerId) {
    return;
  }

  const handleRatingChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setRating(event.target.value);
  };

  const handleReviewChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setReview(event.target.value);
  };

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    dispatch(sendComment({ offerId: offerId, comment: review, rating: Number.parseInt(rating, 10) }));
    setRating('');
    setReview('');
  };

  const isSubmitDisabled = !rating || review.length < 50 || review.length > 300 || reviewSendingStatus;

  const titles = {
    5: 'perfect',
    4: 'good',
    3: 'not bad',
    2: 'badly',
    1: 'terribly'
  };

  return (
    <form className="reviews__form form" onSubmit={handleSubmit}>
      <label className="reviews__label form__label" htmlFor="review">
                Your review
      </label>
      <div className="reviews__rating-form form__rating">
        {[5, 4, 3, 2, 1].map((value) => (
          <React.Fragment key={value}>
            <input
              disabled={reviewSendingStatus}
              className="form__rating-input visually-hidden"
              name="rating"
              value={value}
              id={`${value}-stars`}
              type="radio"
              checked={rating === String(value)}
              onChange={handleRatingChange}
            />
            <label
              htmlFor={`${value}-stars`}
              className="reviews__rating-label form__rating-label"
              title={titles[value as keyof typeof titles]}
            >
              <svg className="form__star-image" width="37" height="33">
                <use xlinkHref="#icon-star"></use>
              </svg>
            </label>
          </React.Fragment>
        ))}
      </div>
      <textarea
        disabled={reviewSendingStatus}
        className="reviews__textarea form__textarea"
        id="review"
        name="review"
        placeholder="Tell how was your stay, what you like and what can be improved"
        value={review}
        onChange={handleReviewChange}
      >
      </textarea>
      <div className="reviews__button-wrapper">
        <p className="reviews__help">
                    To submit review please make sure to set{' '}
          <span className="reviews__star">rating</span> and describe your stay
                    with at least <b className="reviews__text-amount">50 characters</b>.
        </p>
        <button
          className="reviews__submit form__submit button"
          type="submit"
          disabled={isSubmitDisabled}
        >
                    Submit
        </button>
      </div>
    </form>
  );
}

export default ReviewForm;

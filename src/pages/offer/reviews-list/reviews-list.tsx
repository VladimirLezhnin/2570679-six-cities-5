import { Review } from '../../../types';
import ReviewItem from './review-item/review-item';
import { MAX_DISPLAYED_REVIEWS_COUNT } from '../../../const';

type ReviewsListProps = {
    reviews: Review[];
};

function ReviewsList({ reviews }: ReviewsListProps) {
  const reviewsCopy = reviews.slice();

  return (
    <>
      <h2 className="reviews__title">Reviews &middot; <span className="reviews__amount">{reviews.length}</span></h2>
      <ul className="reviews__list">
        {reviewsCopy
          .sort((a, b) => -(new Date(a.date).getTime() - new Date(b.date).getTime()))
          .slice(0, MAX_DISPLAYED_REVIEWS_COUNT)
          .map((review) => <ReviewItem key={review.id} review={review} />)}
      </ul>
    </>
  );
}

export default ReviewsList;

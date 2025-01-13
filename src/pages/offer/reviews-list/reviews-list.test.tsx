import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ReviewsList from './reviews-list';
import { Review } from '../../../types';
import { MAX_DISPLAYED_REVIEWS_COUNT } from '../../../const';
import { getFakeReviews } from '../../../utils/mock/get-fake-reviews';

describe('Component: ReviewsList', () => {
  const mockReviews: Review[] = getFakeReviews();

  it('должен корректно отображать заголовок с количеством отзывов', () => {
    render(<ReviewsList reviews={mockReviews} />);
    expect(screen.getByText(`${mockReviews.length}`)).toBeInTheDocument();
  });

  it('должен отображать не больше MAX_DISPLAYED_REVIEWS_COUNT отзывов', () => {
    render(<ReviewsList reviews={mockReviews} />);
    const displayedReviews = screen.getAllByRole('listitem');
    const expectedCount = Math.min(mockReviews.length, MAX_DISPLAYED_REVIEWS_COUNT);
    expect(displayedReviews).toHaveLength(expectedCount);
  });

  it('должен сортировать отзывы по дате в порядке убывания', () => {
    render(<ReviewsList reviews={mockReviews} />);

    const sortedReviews = mockReviews
      .slice()
      .sort((a, b) => -(new Date(a.date).getTime() - new Date(b.date).getTime()))
      .slice(0, MAX_DISPLAYED_REVIEWS_COUNT);

    const renderedReviews = screen.getAllByRole('listitem');

    sortedReviews.forEach((review, index) => {
      expect(renderedReviews[index]).toHaveTextContent(review.comment);
    });
  });

  it('должен корректно отображать пустой список, если нет отзывов', () => {
    render(<ReviewsList reviews={[]} />);
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
    expect(screen.getByText('0')).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import ReviewItem from './review-item';
import { Review } from '../../../../types';
import { formatDateToMonthYear } from '../../../../helpers/format-date-to-month-year';

vi.mock('../../../../helpers/format-date-to-month-year');

describe('ReviewItem', () => {
  const mockReview: Review = {
    id: '1',
    user: {
      name: 'John Doe',
      avatarUrl: 'https://via.placeholder.com/54',
      isPro: false,
    },
    rating: 4,
    comment: 'This is a great place to stay!',
    date: '2023-10-15T10:00:00.000Z',
  };

  beforeEach(() => {
    (formatDateToMonthYear as jest.Mock).mockImplementation((date: Date) =>
      `${date.getMonth() + 1}/${date.getFullYear()}`
    );
  });

  it('должен рендерить компонент', () => {
    render(<ReviewItem review={mockReview} />);
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('должен отображать аватар пользователя', () => {
    render(<ReviewItem review={mockReview} />);
    const avatar = screen.getByRole('img', { name: 'Reviews avatar' });
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockReview.user.avatarUrl);
    expect(avatar).toHaveAttribute('alt', 'Reviews avatar');
  });

  it('должен отображать имя пользователя', () => {
    render(<ReviewItem review={mockReview} />);
    expect(screen.getByText(mockReview.user.name)).toBeInTheDocument();
  });

  it('должен отображать рейтинг в виде звезд', () => {
    render(<ReviewItem review={mockReview} />);
    const ratingStars = screen.getByText('Rating').previousElementSibling;
    expect(ratingStars).toHaveStyle({ width: `${20 * mockReview.rating}%` });
  });

  it('должен отображать комментарий', () => {
    render(<ReviewItem review={mockReview} />);
    expect(screen.getByText(mockReview.comment)).toBeInTheDocument();
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import ReviewForm from './review-form';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { sendComment } from '../../../api/api-actions';
import { selectOfferId } from '../../../store/selectors';
import { selectReviewSendingStatus } from '../../../store/selectors';

vi.mock('../../../hooks/use-app-dispatch');
vi.mock('../../../hooks/use-app-selector');
vi.mock('../../../api/api-actions');

describe('ReviewForm', () => {
  const mockDispatch = vi.fn();
  const mockOfferId = '123';
  const mockReviewSendingStatus = false;

  beforeEach(() => {
    mockDispatch.mockClear();
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockImplementation((selector) => {
      if (selector === selectOfferId) {
        return mockOfferId;
      }
      if (selector === selectReviewSendingStatus) {
        return mockReviewSendingStatus;
      }
      return undefined;
    });
  });

  it('should render form', () => {
    render(<ReviewForm />);
    expect(screen.getByTestId('review-form')).toBeInTheDocument();
  });

  it('should render rating elements', () => {
    render(<ReviewForm />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByTestId(`rating-${i}`)).toBeInTheDocument();
    }
  });

  it('should render text field for review', () => {
    render(<ReviewForm />);
    const textarea = screen.getByTestId('review-textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('must activate the "Submit" button if the data is valid', () => {
    render(<ReviewForm />);
    const ratingInput = screen.getByTestId('rating-5');
    const textarea = screen.getByTestId('review-textarea');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(ratingInput);
    fireEvent.change(textarea, { target: { value: 'This is a valid review with more than 50 characters.' } });

    expect(submitButton).not.toBeDisabled();
  });

  it('should send data when submitting form', () => {
    render(<ReviewForm />);
    const ratingInput = screen.getByTestId('rating-5');
    const textarea = screen.getByTestId('review-textarea');
    const submitButton = screen.getByTestId('submit-button');

    fireEvent.click(ratingInput);
    fireEvent.change(textarea, { target: { value: 'This is a valid review with more than 50 characters.' } });
    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledWith(
      sendComment({ offerId: mockOfferId, comment: 'This is a valid review with more than 50 characters.', rating: 5 })
    );
  });
});

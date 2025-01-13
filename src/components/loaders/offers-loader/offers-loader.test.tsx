import { render, screen } from '@testing-library/react';
import OffersLoader from './offers-loader';

describe('OffersLoader Component', () => {
  it('renders the correct number of skeleton cards', () => {
    const count = 5;
    render(<OffersLoader count={count} />);

    const skeletonCards = screen.getAllByTestId('skeleton-card');
    expect(skeletonCards).toHaveLength(count);
  });

  it('renders skeleton elements correctly', () => {
    const count = 2;
    render(<OffersLoader count={count} />);

    const skeletonImages = screen.getAllByTestId('skeleton-image');
    const skeletonTitles = screen.getAllByTestId('skeleton-title');
    const skeletonDescriptions = screen.getAllByTestId('skeleton-description');
    const skeletonPrices = screen.getAllByTestId('skeleton-price');

    expect(skeletonImages).toHaveLength(count);
    expect(skeletonTitles).toHaveLength(count);
    expect(skeletonDescriptions).toHaveLength(count);
    expect(skeletonPrices).toHaveLength(count);
  });
});

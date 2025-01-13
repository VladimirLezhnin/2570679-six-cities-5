import { render, screen } from '@testing-library/react';
import OfferGallery from './offer-gallery';

describe('OfferGallery', () => {
  const mockImages = [
    'img1',
    'img2',
    'img3',
  ];

  it('should render the gallery container', () => {
    render(<OfferGallery imageSources={mockImages} />);
    const galleryContainer = screen.getByLabelText(/Offer gallery/i);
    expect(galleryContainer).toBeInTheDocument();
  });

  it('should display all images', () => {
    render(<OfferGallery imageSources={mockImages} />);
    const images = screen.getAllByRole('img');
    expect(images).toHaveLength(mockImages.length);

    mockImages.forEach((source, index) => {
      expect(images[index]).toHaveAttribute('src', source);
      expect(images[index]).toHaveAttribute('alt', 'Photo studio');
    });
  });

  it('should display images in correct wrappers', () => {
    render(<OfferGallery imageSources={mockImages} />);
    const wrappers = screen.getAllByTestId('image-wrapper');
    expect(wrappers).toHaveLength(mockImages.length);
  });

  it('should handle empty image array correctly', () => {
    render(<OfferGallery imageSources={[]} />);
    const images = screen.queryAllByRole('img');
    expect(images).toHaveLength(0);
  });
});

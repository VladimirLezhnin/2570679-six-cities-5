import { render, screen } from '@testing-library/react';
import OfferGoods from './offer-goods';

describe('OfferGoods', () => {
  const mockGoods = ['Wi-Fi', 'Heating', 'Kitchen', 'Cable TV'];

  it('should render the container for the list', () => {
    render(<OfferGoods goods={mockGoods} />);
    const goodsContainer = screen.getByTestId('offer-goods');
    expect(goodsContainer).toBeInTheDocument();
  });

  it('should display title', () => {
    render(<OfferGoods goods={mockGoods} />);
    const title = screen.getByText(/what's inside/i);
    expect(title).toBeInTheDocument();
  });

  it('should render a list of amenities', () => {
    render(<OfferGoods goods={mockGoods} />);
    const list = screen.getByTestId('goods-list');
    expect(list).toBeInTheDocument();
  });

  it('should display all passed elements', () => {
    render(<OfferGoods goods={mockGoods} />);
    const items = screen.getAllByTestId('goods-item');
    expect(items).toHaveLength(mockGoods.length);

    mockGoods.forEach((item, index) => {
      expect(items[index]).toHaveTextContent(item);
    });
  });

  it('should handle empty array correctly', () => {
    render(<OfferGoods goods={[]} />);
    const items = screen.queryAllByTestId('goods-item');
    expect(items).toHaveLength(0);
  });
});

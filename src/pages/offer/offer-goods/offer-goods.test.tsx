import { render, screen } from '@testing-library/react';
import OfferGoods from './offer-goods';

describe('OfferGoods', () => {
  const mockGoods = ['Wi-Fi', 'Heating', 'Kitchen', 'Cable TV'];

  it('должен рендерить контейнер для списка', () => {
    render(<OfferGoods goods={mockGoods} />);
    const goodsContainer = screen.getByTestId('offer-goods');
    expect(goodsContainer).toBeInTheDocument();
  });

  it('должен отображать заголовок', () => {
    render(<OfferGoods goods={mockGoods} />);
    const title = screen.getByText(/what's inside/i);
    expect(title).toBeInTheDocument();
  });

  it('должен рендерить список удобств', () => {
    render(<OfferGoods goods={mockGoods} />);
    const list = screen.getByTestId('goods-list');
    expect(list).toBeInTheDocument();
  });

  it('должен отображать все переданные элементы', () => {
    render(<OfferGoods goods={mockGoods} />);
    const items = screen.getAllByTestId('goods-item');
    expect(items).toHaveLength(mockGoods.length);

    mockGoods.forEach((item, index) => {
      expect(items[index]).toHaveTextContent(item);
    });
  });

  it('должен корректно обрабатывать пустой массив', () => {
    render(<OfferGoods goods={[]} />);
    const items = screen.queryAllByTestId('goods-item');
    expect(items).toHaveLength(0);
  });
});

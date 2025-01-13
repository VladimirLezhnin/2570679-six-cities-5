import { render, screen, fireEvent } from '@testing-library/react';
import { Mock, vi } from 'vitest';
import SortingOptions from './sorting-options';
import { SortingOptionName } from '../../../enums';
import { useAppDispatch } from '../../../hooks/use-app-dispatch';
import { useAppSelector } from '../../../hooks/use-app-selector';
import { changeOffersSortingOption } from '../../../store/action';

vi.mock('../../../hooks/use-app-dispatch');
vi.mock('../../../hooks/use-app-selector');
vi.mock('../../../store/action');

describe('SortingOptions', () => {
  const mockDispatch = vi.fn();
  const mockActiveOption = SortingOptionName.PriceLowToHigh;

  beforeEach(() => {
    (useAppDispatch as Mock).mockReturnValue(mockDispatch);
    (useAppSelector as Mock).mockReturnValue(mockActiveOption);
  });

  it('должен рендерить список опций сортировки', () => {
    render(<SortingOptions />);

    Object.values(SortingOptionName).forEach((option) => {
      if (option === mockActiveOption) {
        expect(screen.getAllByText(option).length).toBe(2);
      } else {
        expect(screen.getAllByText(option).length).toBe(1);
      }
    });
  });

  it('должен отображать активную опцию сортировки', () => {
    render(<SortingOptions />);

    const activeItem = screen.getAllByText(SortingOptionName.PriceLowToHigh).length;
    expect(activeItem).toBe(2);
  });

  it('должен открывать и закрывать список опций при клике на текущую опцию', () => {
    render(<SortingOptions />);

    fireEvent.click(screen.getByTestId('toggleOptions'));

    expect(screen.getByTestId('options')).toHaveClass('places__options--opened');
  });

  it('должен dispatch changeOffersSortingOption при клике на опцию', () => {
    render(<SortingOptions />);

    const option = SortingOptionName.PriceLowToHigh;
    fireEvent.click(screen.getByTestId(SortingOptionName.PriceLowToHigh));

    expect(mockDispatch).toHaveBeenCalledWith(changeOffersSortingOption(option));
  });
});

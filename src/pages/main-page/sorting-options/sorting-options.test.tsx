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

  it('should render a list of sorting options', () => {
    render(<SortingOptions />);

    Object.values(SortingOptionName).forEach((option) => {
      if (option === mockActiveOption) {
        expect(screen.getAllByText(option).length).toBe(2);
      } else {
        expect(screen.getAllByText(option).length).toBe(1);
      }
    });
  });

  it('should display active sort option', () => {
    render(<SortingOptions />);

    const activeItem = screen.getAllByText(SortingOptionName.PriceLowToHigh).length;
    expect(activeItem).toBe(2);
  });

  it('should open and close the list of options when clicking on the current option', () => {
    render(<SortingOptions />);

    fireEvent.click(screen.getByTestId('toggleOptions'));

    expect(screen.getByTestId('options')).toHaveClass('places__options--opened');
  });

  it('should dispatch changeOffersSortingOption when the option is clicked', () => {
    render(<SortingOptions />);

    const option = SortingOptionName.PriceLowToHigh;
    fireEvent.click(screen.getByTestId(SortingOptionName.PriceLowToHigh));

    expect(mockDispatch).toHaveBeenCalledWith(changeOffersSortingOption(option));
  });
});

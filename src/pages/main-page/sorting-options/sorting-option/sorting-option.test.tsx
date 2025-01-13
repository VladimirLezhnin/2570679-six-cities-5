import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SortingOption from './sorting-option';
import { SortingOptionName } from '../../../../enums';

describe('SortingOption', () => {
  const mockHandleOptionClick = vi.fn();
  const option: SortingOptionName = SortingOptionName.PriceLowToHigh;
  const activeOption: SortingOptionName = SortingOptionName.PriceLowToHigh;

  it('should render the sort option', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    expect(screen.getByText(option)).toBeInTheDocument();
  });

  it('should call handleOptionClick on click', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    fireEvent.click(screen.getByText(option));

    expect(mockHandleOptionClick).toHaveBeenCalledWith(option);
  });

  it('should have a class "places__option--active" for the active option', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    expect(screen.getByText(option)).toHaveClass('places__option--active');
  });
});

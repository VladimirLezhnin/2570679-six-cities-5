import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import SortingOption from './sorting-option';
import { SortingOptionName } from '../../../../enums';

describe('SortingOption', () => {
  const mockHandleOptionClick = vi.fn();
  const option: SortingOptionName = SortingOptionName.PriceLowToHigh;
  const activeOption: SortingOptionName = SortingOptionName.PriceLowToHigh;

  it('должен рендерить опцию сортировки', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    expect(screen.getByText(option)).toBeInTheDocument();
  });

  it('должен вызывать handleOptionClick при клике', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    fireEvent.click(screen.getByText(option));

    expect(mockHandleOptionClick).toHaveBeenCalledWith(option);
  });

  it('должен иметь класс "places__option--active" для активной опции', () => {
    render(<SortingOption option={option} activeOption={activeOption} handleOptionClick={mockHandleOptionClick} />);

    expect(screen.getByText(option)).toHaveClass('places__option--active');
  });
});

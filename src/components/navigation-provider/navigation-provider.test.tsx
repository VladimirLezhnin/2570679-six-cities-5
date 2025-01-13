import { render } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NavigationProvider from './navigation-provider';
import { setNavigateFunction } from '../../utils/navigate/navigate-to';
import { useNavigate } from 'react-router-dom';


vi.mock('../../utils/navigate/navigate-to', () => ({
  setNavigateFunction: vi.fn(),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom') ;
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('Component: NavigationProvider', () => {
  it('should call setNavigateFunction with the navigate function when mounting', () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <NavigationProvider />
      </MemoryRouter>
    );

    expect(setNavigateFunction).toHaveBeenCalledTimes(1);
    expect(setNavigateFunction).toHaveBeenCalledWith(mockNavigate);
  });

  it('should not call setNavigateFunction if the component is unmounted', () => {
    const mockNavigate = vi.fn();
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);

    const { unmount } = render(
      <MemoryRouter>
        <NavigationProvider />
      </MemoryRouter>
    );

    unmount();
    expect(setNavigateFunction).toHaveBeenCalledTimes(2);
    expect(setNavigateFunction).toHaveBeenCalledWith(mockNavigate);
  });
});

import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { Mock, vi } from 'vitest';
import NotFoundPage from './not-found-page';

vi.mock('react-router-dom', async () => {
  const actual = (await vi.importActual<typeof import('react-router-dom')>('react-router-dom'));
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NotFoundPage', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    (useNavigate as unknown as Mock).mockReturnValue(mockNavigate);
    vi.clearAllMocks();
  });

  it('should render a component with a 404 error', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Oops! Page not found.')).toBeInTheDocument();
    expect(
      screen.getByText('It looks like you\'ve traveled too far.')
    ).toBeInTheDocument();
    expect(screen.getByText('Go back to homepage')).toBeInTheDocument();
  });

  it('should call navigate with a route to / when the button is clicked', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    );

    const button = screen.getByText('Go back to homepage');
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});

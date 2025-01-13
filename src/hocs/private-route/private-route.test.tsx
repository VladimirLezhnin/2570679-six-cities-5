import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, Mock } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './private-route';
import { AuthorizationStatus, AppRoute } from '../../enums';
import { useAppSelector } from '../../hooks/use-app-selector';
import { useAppDispatch } from '../../hooks/use-app-dispatch';


vi.mock('../../hooks/use-app-selector');
vi.mock('../../hooks/use-app-dispatch');

const ProtectedComponent = () => <div>Protected Content</div>;

describe('HOC: PrivateRoute', () => {
  const mockUseAppSelector = useAppSelector as unknown as Mock;
  const mockUseAppDispatch = useAppDispatch as unknown as Mock;

  beforeEach(() => {
    vi.resetAllMocks();
    mockUseAppDispatch.mockReturnValue(vi.fn());
  });

  it('should render child components if the user is logged in', () => {
    mockUseAppSelector.mockReturnValue(AuthorizationStatus.Auth);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Login} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
    expect(screen.queryByText('Login Page')).not.toBeInTheDocument();
  });

  it('should redirect to login page if user is not logged in', () => {
    mockUseAppSelector.mockReturnValue(AuthorizationStatus.NoAuth);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Login} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });

  it('should display <Navigate> when authorization status is unknown', () => {
    mockUseAppSelector.mockReturnValue(AuthorizationStatus.Unknown);

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <PrivateRoute>
                <ProtectedComponent />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Login} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
  });
});

import { Mock, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Login from './login';
import { withHistory, withStore } from '../../utils/with-utils/with-utils';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus, AppRoute } from '../../enums';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { loginAction } from '../../api/api-actions';


vi.mock('../../components/header/header', () => ({
  default: () => <div data-testid="header">Mocked Header</div>,
}));


vi.mock('../../utils/navigate/navigate-to', () => ({
  navigateTo: vi.fn(),
}));


vi.mock('../../api/api-actions', () => ({
  loginAction: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  changeCity: vi.fn(),
}));

vi.mock('../../hooks/use-app-selector', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../hooks/use-app-dispatch', () => ({
  useAppDispatch: vi.fn(),
}));

import { navigateTo } from '../../utils/navigate/navigate-to';
import { useAppSelector as mockedUseAppSelector } from '../../hooks/use-app-selector';

describe('Component: Login', () => {
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAppDispatch as unknown as Mock).mockReturnValue(mockDispatch);
  });

  it('должен рендерить форму входа для неавторизованного пользователя', () => {
    (mockedUseAppSelector as unknown as Mock).mockReturnValue(AuthorizationStatus.NoAuth);

    const { withStoreComponent } = withStore(
      withHistory(<Login />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          userData: undefined,
        },
      })
    );

    render(withStoreComponent);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByRole('form')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in/i })).toBeInTheDocument();
  });

  it('должен перенаправлять авторизованного пользователя на главную страницу', () => {
    (mockedUseAppSelector as unknown as Mock).mockReturnValue(AuthorizationStatus.Auth);
    const { withStoreComponent } = withStore(
      withHistory(<Login />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: { name: 'User', email: 'user@example.com', avatarUrl: 'avatar', isPro: false, token: '12345' },
        },
      })
    );

    render(withStoreComponent);
    expect(navigateTo).toHaveBeenCalledWith(AppRoute.Root);
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('должен dispatch loginAction с правильными данными при отправке формы', () => {
    (mockedUseAppSelector as unknown as Mock).mockReturnValue(AuthorizationStatus.NoAuth);
    const { withStoreComponent } = withStore(
      withHistory(<Login />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.NoAuth,
          userData: undefined,
        },
      })
    );

    render(withStoreComponent);

    const emailInput = screen.getByPlaceholderText('Email') ;
    const passwordInput = screen.getByPlaceholderText('Password') ;
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    fireEvent.click(submitButton);

    expect(mockDispatch).toHaveBeenCalledWith(loginAction({ email: 'test@example.com', password: 'Password123' }));
  });
});

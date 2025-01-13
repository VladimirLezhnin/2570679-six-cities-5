import { Mock, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Login from './login'; // Убедитесь, что путь корректный
import { withHistory, withStore } from '../../utils/with-store/with-store';
import { getFakeStore } from '../../utils/mock/get-fake-store';
import { AuthorizationStatus, AppRoute } from '../../enums';
import { Offer } from '../../types';
import { useAppSelector } from '../../hooks/use-app-selector';
import { useAppDispatch } from '../../hooks/use-app-dispatch';
import { loginAction } from '../../api/api-actions';
import { changeCity } from '../../store/action';
import { Cities } from '../../mocks/cities';

// 1. Мокируем дочерние компоненты до импорта
vi.mock('../../components/header/header', () => ({
  default: () => <div data-testid="header">Mocked Header</div>,
}));

// 2. Мокируем функции
vi.mock('../../utils/navigate/navigate-to', () => ({
  navigateTo: vi.fn(),
}));

// 3. Мокируем действия Redux
vi.mock('../../api/api-actions', () => ({
  loginAction: vi.fn(),
}));

vi.mock('../../store/action', () => ({
  changeCity: vi.fn(),
}));

// 4. Мокируем OffersList, если он используется внутри Login (в данном случае не используется)

// 5. Мокируем хуки
vi.mock('../../hooks/use-app-selector', () => ({
  useAppSelector: vi.fn(),
}));

vi.mock('../../hooks/use-app-dispatch', () => ({
  useAppDispatch: vi.fn(),
}));

// Импортируем моки после их определения
import { navigateTo } from '../../utils/navigate/navigate-to';
import { loginAction as mockedLoginAction } from '../../api/api-actions';
import { changeCity as mockedChangeCity } from '../../store/action';
import { useAppSelector as mockedUseAppSelector } from '../../hooks/use-app-selector';
import { useAppDispatch as mockedUseAppDispatch } from '../../hooks/use-app-dispatch';

describe('Component: Login', () => {
  const mockDispatch = vi.fn();
  const mockCity = Cities[0]; // Используем первый город из моков

  beforeEach(() => {
    vi.clearAllMocks(); // Очищаем все моки перед каждым тестом
    (useAppDispatch as unknown as Mock).mockReturnValue(mockDispatch);
  });

  it('должен рендерить форму входа для неавторизованного пользователя', () => {
    // Мокаем селектор, возвращая статус неавторизованного пользователя
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

    // Проверяем наличие Header
    expect(screen.getByTestId('header')).toBeInTheDocument();

    // Проверяем наличие формы входа
    expect(screen.getByRole('form')).toBeInTheDocument();

    // Проверяем наличие полей ввода email и password
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Проверяем наличие кнопки отправки формы
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();

    // Проверяем наличие ссылки города
    expect(screen.getByRole('link', { name: mockCity.name })).toBeInTheDocument();
  });

  it('должен перенаправлять авторизованного пользователя на главную страницу', () => {
    // Мокаем селектор, возвращая статус авторизованного пользователя
    (mockedUseAppSelector as unknown as Mock).mockReturnValue(AuthorizationStatus.Auth);

    const { withStoreComponent } = withStore(
      withHistory(<Login />),
      getFakeStore({
        auth: {
          authorizationStatus: AuthorizationStatus.Auth,
          userData: { id: "1", name: 'User', email: 'user@example.com' },
        },
      })
    );

    render(withStoreComponent);

    // Проверяем, что navigateTo был вызван с маршрутом главной страницы
    expect(navigateTo).toHaveBeenCalledWith(AppRoute.Root);

    // Проверяем, что компонент не рендерится
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
  });

  it('должен dispatch loginAction с правильными данными при отправке формы', () => {
    // Мокаем селектор, возвращая статус неавторизованного пользователя
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

    // Вводим email и password
    const emailInput = screen.getByPlaceholderText('Email') as HTMLInputElement;
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const submitButton = screen.getByRole('button', { name: /Sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123' } });

    // Отправляем форму
    fireEvent.click(submitButton);

    // Проверяем, что dispatch был вызван с loginAction и правильными данными
    expect(mockDispatch).toHaveBeenCalledWith(loginAction({ email: 'test@example.com', password: 'Password123' }));
  });

  it('должен dispatch changeCity при клике на ссылку города', () => {
    // Мокаем селектор, возвращая статус неавторизованного пользователя
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

    // Находим ссылку города
    const cityLink = screen.getByRole('link', { name: mockCity.name });

    // Кликаем по ссылке
    fireEvent.click(cityLink);

    // Проверяем, что dispatch был вызван с changeCity и правильным городом
    expect(mockDispatch).toHaveBeenCalledWith(changeCity(mockCity));
  });
});

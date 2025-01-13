import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { createAPI } from './api';
import { getToken } from './token';
import { toast } from 'react-toastify';


vi.mock('./token', () => ({
  getToken: vi.fn(),
}));

vi.mock('react-toastify', () => ({
  toast: {
    warn: vi.fn(),
  },
}));

describe('API: createAPI', () => {
  let mockAxios: MockAdapter;
  let api: ReturnType<typeof createAPI>;

  const BACKEND_URL = 'https://14.design.htmlacademy.pro';
  const REQUEST_TIMEOUT = 5000;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    api = createAPI();
  });

  afterEach(() => {
    mockAxios.reset();
    vi.resetAllMocks();
  });

  it('must create an Axios instance with the correct settings', () => {
    expect(api.defaults.baseURL).toBe(BACKEND_URL);
    expect(api.defaults.timeout).toBe(REQUEST_TIMEOUT);
  });

  it('should add "x-token" header if token is present', async () => {
    (getToken as unknown as Mock).mockReturnValue('mocked-token');

    mockAxios.onGet('/test-endpoint').reply(200, { success: true });

    const response = await api.get('/test-endpoint');

    const requestHeaders = mockAxios.history.get[0].headers;
    expect(requestHeaders).not.toBeUndefined();
    expect(requestHeaders!['x-token']).toBe('mocked-token');

    expect(response.data).toEqual({ success: true });
  });

  it('should not add "x-token" header if token is missing', async () => {
    (getToken as unknown as Mock).mockReturnValue(null);

    mockAxios.onGet('/test-endpoint').reply(200, { success: true });

    const response = await api.get('/test-endpoint');

    const requestHeaders = mockAxios.history.get[0].headers;
    expect(requestHeaders).not.toBeUndefined();
    expect(requestHeaders!['x-token']).toBeUndefined();
    expect(response.data).toEqual({ success: true });
  });

  it('should show toast.warn with message when replying with code 400', async () => {
    (getToken as unknown as Mock).mockReturnValue('mocked-token');

    mockAxios.onPost('/test-endpoint').reply(400, {
      type: 'ValidationError',
      message: 'Invalid input data',
    });

    await expect(api.post('/test-endpoint', { data: 'test' })).rejects.toThrow();

    expect(toast.warn).toHaveBeenCalledWith('Invalid input data');
  });

  it('should not show toast.warn when responding with a different error code', async () => {
    (getToken as unknown as Mock).mockReturnValue('mocked-token');

    mockAxios.onGet('/test-endpoint').reply(500, {
      type: 'ServerError',
      message: 'Internal Server Error',
    });

    await expect(api.get('/test-endpoint')).rejects.toThrow();

    expect(toast.warn).not.toHaveBeenCalled();
  });

  it('should throw an error after processing', async () => {
    (getToken as unknown as Mock).mockReturnValue('mocked-token');

    mockAxios.onDelete('/test-endpoint').reply(400, {
      type: 'BadRequest',
      message: 'Bad Request',
    });

    await expect(api.delete('/test-endpoint')).rejects.toThrow();

    expect(toast.warn).toHaveBeenCalledWith('Bad Request');
  });
});

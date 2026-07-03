export class ApiError extends Error {
  status: number;
  code?: string;
  details?: any;

  constructor(message: string, status: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

const getBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
};

export interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
  _retry?: boolean;
}

export type RequestInterceptor = (url: string, config: RequestOptions) => RequestOptions | Promise<RequestOptions>;
export type ResponseInterceptor = (response: Response) => Response | Promise<Response>;

export const requestInterceptors: RequestInterceptor[] = [];
export const responseInterceptors: ResponseInterceptor[] = [];

// Logger interceptors (disabled in tests)
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  requestInterceptors.push((url, config) => {
    console.log(`[API Request] ${config.method || 'GET'} ${url}`);
    return config;
  });

  responseInterceptors.push((response) => {
    console.log(`[API Response] ${response.status} ${response.url}`);
    return response;
  });
}

let refreshPromise: Promise<string> | null = null;

export async function apiClient(path: string, options: RequestOptions = {}): Promise<any> {
  const baseUrl = getBaseUrl();
  let url = path.startsWith('http') ? path : `${baseUrl}${path}`;

  if (options.params) {
    const searchParams = new URLSearchParams(options.params);
    url += `?${searchParams.toString()}`;
  }

  let config: RequestOptions = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // 1. Inject Authorization header if we have an accessToken stored
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token && !(config.headers as Record<string, string>)['Authorization']) {
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
  }

  // 2. Run request interceptors
  for (const interceptor of requestInterceptors) {
    config = await interceptor(url, config);
  }

  let response: Response;
  try {
    response = await fetch(url, config);
  } catch (err) {
    throw new ApiError(err instanceof Error ? err.message : 'Network error', 0);
  }

  // 3. Run response interceptors
  for (const interceptor of responseInterceptors) {
    response = await interceptor(response);
  }

  // 4. Handle 401 response and attempt token refresh
  if (response.status === 401 && !config._retry && !path.includes('/auth/refresh') && !path.includes('/auth/login')) {
    config._retry = true;

    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            try {
              const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken }),
              });

              if (!refreshRes.ok) {
                throw new Error('Refresh failed');
              }

              const refreshJson = await refreshRes.json();
              const newAccessToken = refreshJson.data?.accessToken;

              if (!newAccessToken) {
                throw new Error('No access token in refresh response');
              }

              localStorage.setItem('accessToken', newAccessToken);
              localStorage.setItem('token', newAccessToken);
              return newAccessToken;
            } catch (refreshErr) {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
              window.dispatchEvent(new CustomEvent('auth-logout'));
              throw new ApiError('Session expired. Please log in again.', 401, 'UNAUTHORIZED_EXPIRED');
            } finally {
              refreshPromise = null;
            }
          })();
        }

        try {
          const newToken = await refreshPromise;
          const retryHeaders = {
            ...config.headers,
            'Authorization': `Bearer ${newToken}`
          };
          const retryRes = await fetch(url, { ...config, headers: retryHeaders });
          return handleResponse(retryRes);
        } catch (err) {
          throw err;
        }
      }
    }
  }

  return handleResponse(response);
}

async function handleResponse(response: Response): Promise<any> {
  const contentType = response.headers.get('content-type');
  let json: any = null;
  if (contentType && contentType.includes('application/json')) {
    try {
      json = await response.json();
    } catch {
      // Ignore parse failure
    }
  }

  if (!response.ok) {
    if (json && json.error) {
      throw new ApiError(
        json.error.message || 'API Error',
        response.status,
        json.error.code,
        json.error.details
      );
    }
    throw new ApiError(response.statusText || 'API Error', response.status);
  }

  if (json && 'data' in json) {
    return json.data;
  }
  return json;
}

apiClient.get = (path: string, options?: RequestOptions) => 
  apiClient(path, { ...options, method: 'GET' });

apiClient.post = (path: string, body?: any, options?: RequestOptions) => 
  apiClient(path, { 
    ...options, 
    method: 'POST', 
    body: body !== undefined ? JSON.stringify(body) : undefined 
  });

apiClient.put = (path: string, body?: any, options?: RequestOptions) => 
  apiClient(path, { 
    ...options, 
    method: 'PUT', 
    body: body !== undefined ? JSON.stringify(body) : undefined 
  });

apiClient.patch = (path: string, body?: any, options?: RequestOptions) => 
  apiClient(path, { 
    ...options, 
    method: 'PATCH', 
    body: body !== undefined ? JSON.stringify(body) : undefined 
  });

apiClient.delete = (path: string, options?: RequestOptions) => 
  apiClient(path, { ...options, method: 'DELETE' });

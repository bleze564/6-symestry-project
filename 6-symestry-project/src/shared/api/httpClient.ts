const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '')

type ApiRequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

export class ApiError extends Error {
  readonly status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function getErrorMessage(data: unknown): string {
  if (
    typeof data === 'object' &&
    data !== null &&
    'message' in data &&
    typeof data.message === 'string'
  ) {
    return data.message
  }

  return 'Не вдалося виконати запит до сервера.'
}

export async function apiRequest<T>(
  path: string,
  { body, headers: requestHeaders, ...options }: ApiRequestOptions = {},
): Promise<T> {
  const headers = new Headers(requestHeaders)

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  const responseData: unknown = await response.json().catch(() => undefined)

  if (!response.ok) {
    throw new ApiError(getErrorMessage(responseData), response.status)
  }

  return responseData as T
}

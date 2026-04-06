import type {
  AuthTokens,
  AuthUser,
  LoginPayload,
  LoginResponse,
  RefreshResponse,
} from "@/app/login/types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

class AuthRequestError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "AuthRequestError";
    this.status = status;
  }
}

function buildUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function parseJson<T>(response: Response): Promise<T> {
  const data = (await response.json().catch(() => null)) as T | null;

  if (!response.ok || !data) {
    throw new AuthRequestError("Nao foi possivel processar a resposta da API.", response.status);
  }

  return data;
}

function mapUser(user: LoginResponse["user"]): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
  };
}

export async function loginRequest(payload: LoginPayload) {
  const response = await fetch(buildUrl("/api/v1/auth/login/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (response.status === 401) {
    throw new AuthRequestError("Email ou senha invalidos.", response.status);
  }

  const data = await parseJson<LoginResponse>(response);

  return {
    tokens: {
      accessToken: data.access,
      refreshToken: data.refresh,
    },
    user: mapUser(data.user),
  };
}

export async function refreshRequest(refreshToken: string) {
  const response = await fetch(buildUrl("/api/v1/auth/refresh/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    throw new AuthRequestError("Sua sessao expirou. Faca login novamente.", response.status);
  }

  const data = await parseJson<RefreshResponse>(response);

  return {
    accessToken: data.access,
    refreshToken: data.refresh ?? refreshToken,
  };
}

export async function logoutRequest(refreshToken: string) {
  await fetch(buildUrl("/api/v1/auth/logout/"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  }).catch(() => undefined);
}

export async function fetchCurrentUser(accessToken: string) {
  const response = await fetch(buildUrl("/api/v1/auth/me/"), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    throw new AuthRequestError("Nao foi possivel carregar os dados do usuario.", response.status);
  }

  const data = await parseJson<LoginResponse["user"]>(response);

  return mapUser(data);
}

export async function restoreUserSession(tokens: AuthTokens) {
  try {
    const user = await fetchCurrentUser(tokens.accessToken);

    return { tokens, user };
  } catch (error) {
    if (!(error instanceof AuthRequestError) || error.status !== 401) {
      throw error;
    }
  }

  const refreshedTokens = await refreshRequest(tokens.refreshToken);
  const user = await fetchCurrentUser(refreshedTokens.accessToken);

  return { tokens: refreshedTokens, user };
}

export { AuthRequestError };

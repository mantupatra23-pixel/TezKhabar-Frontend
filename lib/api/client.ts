export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") || "https://tezkhabar.onrender.com";

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

export class ApiError extends Error {
  status: number;
  statusText: string;

  constructor(message: string, status: number, statusText: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.statusText = statusText;
  }
}

export async function apiClient<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
  const { params, timeoutMs = 12000, headers, ...customConfig } = options;

  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  // Append query params if provided
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      cleanEndpoint += `${cleanEndpoint.includes("?") ? "&" : "?"}${queryString}`;
    }
  }

  const targetUrl = `${API_BASE_URL}${cleanEndpoint}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(targetUrl, {
      ...customConfig,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timer);

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(`[API Error] ${response.status} ${response.statusText} at ${targetUrl}:`, errorBody);
      throw new ApiError(
        `API request failed with status ${response.status}`,
        response.status,
        response.statusText
      );
    }

    return (await response.json()) as T;
  } catch (error: any) {
    clearTimeout(timer);
    if (error.name === "AbortError") {
      console.error(`[API Timeout] Request timed out after ${timeoutMs}ms: ${targetUrl}`);
      throw new ApiError("Request timed out", 408, "Timeout");
    }
    throw error;
  }
}

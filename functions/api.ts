interface RequestOptions extends RequestInit {
  maxRetries?: number;
  retryDelay?: number;
  token?: string;
}

interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

async function makeRequest<T>(url: string, options: RequestOptions = {}): Promise<ApiResponse<T>> {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    token,
    ...fetchOptions
  } = options;

  // Add authorization header if token is provided
  if (token) {
    fetchOptions.headers = {
      ...fetchOptions.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        // Wait before retrying, with exponential backoff
        await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt - 1)));
      }

      const response = await fetch(url, fetchOptions);
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // Verify we have JSON content
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error(`Expected JSON response but got ${contentType}`);
      }

      const data = await response.json();
      
      // Check for Reddit API error response
      if (data.error) {
        throw new Error(data.message || 'Reddit API error');
      }

      return { data, error: null };

    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Log retry attempts
      if (attempt < maxRetries - 1) {
        console.warn(`Request failed, attempt ${attempt + 1} of ${maxRetries}:`, lastError.message);
      }
    }
  }

  // All retries failed
  console.error('All request attempts failed:', lastError);
  return { data: null, error: lastError };
}

export const api = {
  fetch: makeRequest
}; 
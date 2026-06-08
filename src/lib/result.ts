import { toast } from 'sonner';

export type ApiError = {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
};

export function extractApiError(error: unknown): ApiError {
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosErr = error as {
      response?: {
        status?: number;
        data?: { message?: string; error?: string; errors?: Record<string, string[]> };
      };
    };
    return {
      message: axiosErr.response?.data?.message || axiosErr.response?.data?.error || 'An error occurred',
      status: axiosErr.response?.status,
      errors: axiosErr.response?.data?.errors,
    };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: 'An unexpected error occurred' };
}

export function handleApiError(error: unknown, fallbackMessage = 'Something went wrong'): ApiError {
  const parsed = extractApiError(error);
  toast.error(parsed.message || fallbackMessage);
  return parsed;
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === 'object' && error !== null && 'message' in error;
}

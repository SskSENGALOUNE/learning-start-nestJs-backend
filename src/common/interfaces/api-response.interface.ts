export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  count?: number;
  meta?: unknown;
  data: T;
  timestamp: string;
  path: string;
}

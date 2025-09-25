export type SuccessResponse<T> = T;
export type ErrorResponse = {
  statusCode: number;
  message: string;
  error: string;
};

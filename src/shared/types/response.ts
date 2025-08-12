export type SuccessResponse<T> = {
  code: number;
  message: string;
  data: T;
};

export type ErrorResponse = {
  code: number;
  message: string;
  error: string;
};

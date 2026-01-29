export type SuccessResponse<T> = T;
export type ErrorResponse = {
  statusCode: number;
  message: string | string[];
  error: string | string[];
};


export type MessageResponse = {
  message: string;
};
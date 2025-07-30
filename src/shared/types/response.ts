export type SuccessResponse<T> = {
  code: number;
  message: string;
  data: T;
};

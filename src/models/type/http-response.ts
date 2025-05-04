export type HTTPResponse<T = unknown> = {
  code: number;
  message: string;
  data?: T;
};

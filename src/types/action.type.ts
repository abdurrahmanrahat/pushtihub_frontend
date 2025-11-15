export type TServerResponse<T = any> = {
  success: boolean;
  data: T | null;
  message: string;
};

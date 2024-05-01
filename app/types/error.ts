export interface IErrorResponse<T = any> {
  status: "error";
  message: string;
  data?: T;
}

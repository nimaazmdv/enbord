export interface AppError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface AppValidationError {
  context: { code: string };
  message: string;
}

export type ErrorsObject = Record<
  string,
  AppError | AppValidationError | ((args: any) => AppError | AppValidationError)
>;

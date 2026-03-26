export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors: any[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Application error with HTTP status code
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Validation error for invalid input data
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "ValidationError";
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
}

/**
 * Unauthorized error - authentication failed
 */
export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

/**
 * Forbidden error - access denied
 */
export class ForbiddenError extends AppError {
  constructor(message: string = "Forbidden") {
    super(message, 403);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

/**
 * Not found error - resource doesn't exist
 */
export class NotFoundError extends AppError {
  constructor(message: string = "Not found") {
    super(message, 404);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export const createError = (
  statusCode: number,
  message: string,
  errors: any[] = [],
): ApiError => {
  return new ApiError(statusCode, message, errors);
};

class ApiError extends Error {
  constructor(
    message = "Something Went wrong !",
    statusCode,
    errors = [],
    stack = ""
  ) {
    super(message);
    this.message = message;
    this.sucess = false;
    this.data = null;
    this.errors = errors;
    this.statusCode = statusCode;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };

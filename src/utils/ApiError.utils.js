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


class ValidationError extends ApiError{
  constructor(message,skip=false){
    super(message,422)
  }
}

class BadRequestError extends ApiError{
  constructor(message,skip=false){
    super(message,400)
  }
}

class UnauthorizedError extends ApiError{
  constructor(message,skip=false){
    super(message,401)
  }
}



export { ApiError,BadRequestError,UnauthorizedError,ValidationError };

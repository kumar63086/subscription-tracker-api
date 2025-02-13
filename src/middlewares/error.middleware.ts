import { Request, Response, NextFunction } from 'express';

// Define a custom error interface
interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  errors?: { [key: string]: { message: string } };
}

const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Create a shallow copy of the error
    let error: CustomError = { ...err };
    error.message = err.message;

    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = 'Resource not found';
      error = new Error(message) as CustomError;
      error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = new Error(message) as CustomError;
      error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError' && err.errors) {
      const message = Object.values(err.errors).map(
        (val: { message: string }) => val.message
      );
      error = new Error(message.join(', ')) as CustomError;
      error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
      success: false,
      error: error.message || 'Server Error',
    });
  } catch (e: unknown) {
    next(e);
  }
};

export default errorMiddleware;

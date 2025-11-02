import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal server error';

  logger.error(`Error: ${code} - ${message}`, {
    path: req.path,
    method: req.method,
    stack: err.stack
  });

  res.status(statusCode).json({
    ok: false,
    error: {
      code,
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    },
    data: null,
    meta: {
      timestamp: new Date().toISOString()
    }
  });
};


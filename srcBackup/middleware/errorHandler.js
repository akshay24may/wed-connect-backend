import { errorResponse } from '#utils/responseFormatter.js';

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return errorResponse(res, err.message, 400, 'VALIDATION_ERROR');
  }

  if (err.name === 'UnauthorizedError') {
    return errorResponse(res, 'Unauthorized access', 401, 'UNAUTHORIZED');
  }

  if (err.name === 'SequelizeValidationError') {
    const errors = err.errors.map(e => ({
      field: e.path,
      message: e.message
    }));
    return res.status(400).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    return errorResponse(res, 'Resource already exists', 409, 'CONFLICT');
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return errorResponse(res, 'Invalid reference', 400, 'INVALID_REFERENCE');
  }

  return errorResponse(res, err.message || 'Internal server error', err.statusCode || 500);
};

export default errorHandler;

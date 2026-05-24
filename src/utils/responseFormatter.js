export const successResponse = (res, data = null, message = 'Success', code = 'SUCCESS') => {
  return res.status(200).json({
    success: true,
    code,
    message,
    data
  });
};

export const createResponse = (res, data = null, message = 'Created successfully', code = 'CREATED') => {
  return res.status(201).json({
    success: true,
    code,
    message,
    data
  });
};

export const errorResponse = (res, message = 'Error occurred', statusCode = 500, code = 'INTERNAL_ERROR') => {
  return res.status(statusCode).json({
    success: false,
    code,
    message
  });
};

export const validationErrorResponse = (res, errors, message = 'Validation failed', code = 'VALIDATION_ERROR') => {
  return res.status(400).json({
    success: false,
    code,
    message,
    errors
  });
};

export const unauthorizedResponse = (res, message = 'Unauthorized access', code = 'UNAUTHORIZED') => {
  return res.status(401).json({
    success: false,
    code,
    message
  });
};

export const forbiddenResponse = (res, message = 'Access forbidden', code = 'FORBIDDEN') => {
  return res.status(403).json({
    success: false,
    code,
    message
  });
};

export const notFoundResponse = (res, message = 'Resource not found', code = 'NOT_FOUND') => {
  return res.status(404).json({
    success: false,
    code,
    message
  });
};

export const conflictResponse = (res, message = 'Resource already exists', code = 'CONFLICT') => {
  return res.status(409).json({
    success: false,
    code,
    message
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Data retrieved successfully', code = 'SUCCESS') => {
  return res.status(200).json({
    success: true,
    code,
    message,
    data: {
      items: data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        totalPages: pagination.totalPages,
        totalItems: pagination.totalItems,
        hasNext: pagination.page < pagination.totalPages,
        hasPrev: pagination.page > 1
      }
    }
  });
};

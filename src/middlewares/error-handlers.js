import {validationResult} from 'express-validator';

const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

const validationErrors = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');

    const error = new Error(messages);
    error.status = 400;
    next(error);
    return;
  }

  next();
};

const errorHandler = (err, req, res, next) => {
  // Multer: file larger than 10 MB
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.status = 400;
  }

  res.status(err.status || 500);

  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

export {
  notFoundHandler,
  validationErrors,
  errorHandler,
};
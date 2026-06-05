const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for dev
  console.error(err);

  // Prisma Unique constraint failed
  if (err.code === 'P2002') {
    const message = `Duplicate field value entered: ${err.meta?.target}`;
    error = { message, statusCode: 400 };
  }

  // Prisma Record not found
  if (err.code === 'P2025') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(error.statusCode || statusCode).json({
    success: false,
    message: error.message || 'Server Error'
  });
};

module.exports = errorHandler;

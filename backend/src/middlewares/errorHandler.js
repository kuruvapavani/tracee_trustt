const errorHandler = (err, req, res, next) => {
  console.error(err.stack); // Log the error stack for debugging purposes

  // Determine status code: use existing status code or default to 500 (Internal Server Error)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  res.json({
    message: err.message,
    // Only send stack trace in development environment for security
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = errorHandler;
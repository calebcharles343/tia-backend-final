const handleResponse = (res, status, message, data = null) => {
  const amount = data ? data.length : undefined;

  res.status(status).json({
    status,
    message,
    amount,
    data,
  });
};

module.exports = handleResponse;

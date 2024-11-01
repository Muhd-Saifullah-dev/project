const okResponse = (res, message, data, status, token = null) => {
  const response = {
    success: true,
    message,
    data,
    token,
    status,
  };
  return res.status(response.status).json(response);
};

const handleError = (res, status, message, data) => {
  const response = {
    success: false,
    status,
    message,
    data,
  };

  return res.status(response.status).json(response);
};

export { handleError, okResponse };

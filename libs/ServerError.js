class ServerError extends Error {
  constructor(status = 500, message = '', code = 'ERROR', data = null) {
    const defaultMessages = {
      400: 'Bad Request',
      401: 'Unauthorized',
      403: 'Forbidden',
      404: 'Not Found'
    };

    super(message || defaultMessages[status] || 'An unknown error occurred');
    this.name = 'ServerError';
    this.code = code;
    this.status = status;
    this.data = data;
  }

  static express404Handler(req, res, next) {
    next(new ServerError(404, 'Endpoint not found'));
  }

  static express500Handler(err, req, res, next) {
    try {
      if (err && err.constructor === ServerError) {
        res.status(err.status);
        res.json({
          message: err.message,
          code: err.code,
          data: err.data
        });
        return;
      }

      res.status(500);
      res.json({
        message: err.message || 'An Unknown error occurred.',
        code: 'ERROR',
        data: null
      });
    }
    catch {
      res.status(500);
      res.json({
        message: 'An Unknown error occurred.',
        code: 'ERROR',
        data: null
      });
    }
  }

  static throw(status = undefined, message = undefined, code = undefined, data = undefined) {
    throw new ServerError(status, message, code, data);
  }
}
module.exports = ServerError;

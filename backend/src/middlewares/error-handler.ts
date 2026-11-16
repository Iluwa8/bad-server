import { ErrorRequestHandler } from 'express';
import { escape } from 'html-escaper';

const errorHandler: ErrorRequestHandler = (err, _req, res, next) => {
  const statusCode = err.statusCode || 500;
  const rawMessage =
    statusCode === 500 ? 'На сервере произошла ошибка' : err.message;

  // Экранируем HTML-спецсимволы, чтобы исключить XSS
  const message = escape(rawMessage);

  // Логируем только в development, чтобы не переполнять диск в production
  if (process.env.NODE_ENV !== 'production') {
    console.log(err);
  }

  res.status(statusCode).send({ message });
  next();
};

export default errorHandler;

import { errors } from 'celebrate';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import apicache from 'apicache';
import mongoose from 'mongoose';
import path from 'path';
import { DB_ADDRESS } from './config';
import errorHandler from './middlewares/error-handler';
import serveStatic from './middlewares/serverStatic';
import routes from './routes';

const { PORT = 3000 } = process.env;
const app = express();

app.use(cookieParser());
app.use(cors());

// 1. Санитизация от NoSQL-инъекций (удаляет $ и . из ключей)
app.use(mongoSanitize());

// 2. Rate limiting (защита от DDoS)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 минута
  max: 100, // при необходимости поднимите для нагрузочных тестов
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Слишком много запросов, попробуйте позже.' },
});
app.use(limiter);

// 3. CSRF-защита
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Эндпоинт для получения CSRF-токена клиентом
app.get('/auth/csrf-token', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// 4. Статика с защитой от Path Traversal
app.use(serveStatic(path.join(__dirname, 'public')));

// 5. Кэширование часто запрашиваемых ресурсов
app.use('/product', apicache.middleware('5 minutes'));

app.use(urlencoded({ extended: true }));
app.use(json());
app.options('*', cors());
app.use(routes);
app.use(errors());
app.use(errorHandler);

// eslint-disable-next-line no-console
const bootstrap = async () => {
  try {
    await mongoose.connect(DB_ADDRESS);
    await app.listen(PORT, () => console.log('ok'));
  } catch (error) {
    console.error(error);
  }
};

bootstrap();

# WebLarek Backend — Security Audit

## Ссылка на репозиторий
https://github.com/Iluwa8/bad-server

## Автор
- **Имя:** Илья Соколов
- **Когорта:** <номер когорты>
- **Курс:** <название курса>

## Опубликованная версия
(если есть) https://...

## Выполненные исправления

### Безопасность
- **XSS** — `sanitize-html` в `models/user.ts`, `models/product.ts`, `models/order.ts`; `html-escaper` в `middlewares/error-handler.ts`.
- **CSRF** — `csurf` на всех state-changing маршрутах, эндпоинт `GET /csrf-token`.
- **NoSQL-инъекции** — `express-mongo-sanitize` + явное приведение типов в контроллерах (`String(...)`, `Number(...)`).
- **Переполнение буфера** — multer `limits.fileSize = 5 MB`, `files = 1`; `maxlength` в схемах Mongoose и `.max()` в Joi.
- **ReDoS** — `escapeRegExp` перед `new RegExp`, безопасный `phoneRegExp` без вложенных квантификаторов.
- **DDoS** — `express-rate-limit` (100 req/min/IP), кэширование `/product` через `apicache`.
- **Path Traversal** — проверка `filePath.startsWith(resolvedBase)` в `middlewares/serverStatic.ts`.
- **Права доступа** — `roleGuardMiddleware(Role.Admin)` на `/customers` и `/order/all`.

### Качество кода
- **npm audit** — 0 уязвимостей (обновлены `@faker-js/faker`, `sharp`, `celebrate`, `multer`; scoped override `minimatch` для `eslint-plugin-import`).
- **ESLint** — 0 errors, 0 warnings.
- **TypeScript** — `tsc --noEmit` без ошибок; убраны deprecated-опции в `tsconfig.json`.

### Дополнительно
- **movingFile** — заменён `rename` на `renameSync`, устранена гонка при переносе изображения.

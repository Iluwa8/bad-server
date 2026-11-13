import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export default function serveStatic(baseDir: string) {
  const resolvedBase = path.resolve(baseDir);

  return (req: Request, res: Response, next: NextFunction) => {
    const filePath = path.resolve(resolvedBase, `.${req.path}`);

    // Защита от Path Traversal
    if (
      !filePath.startsWith(resolvedBase + path.sep) &&
      filePath !== resolvedBase
    ) {
      return res.status(403).send('Доступ запрещён');
    }

    fs.stat(filePath, (err, stats) => {
      // Файла нет или это директория — пусть обрабатывают маршруты / 404
      if (err || !stats.isFile()) {
        return next();
      }
      return res.sendFile(filePath, (sendErr) => {
        if (sendErr) {
          next(sendErr);
        }
      });
    });
  };
}

import { NextFunction, Request, Response } from 'express';
import { unlinkSync } from 'fs';
import BadRequestError from '../errors/bad-request-error';

export const uploadFile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.file) {
    return next(new BadRequestError('Файл не загружен'));
  }

  if (req.file.size <= 2048) {
    unlinkSync(req.file.path); // Удаляем файл
    return next(new BadRequestError('Размер файла должен быть больше 2КБ'));
  }

  return res.status(200).json({
    fileName: `/${process.env.UPLOAD_PATH}/${req.file.filename}`,
    originalName: req.file.originalname,
  });
};

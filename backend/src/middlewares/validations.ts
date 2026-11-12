import { Joi, celebrate } from 'celebrate';
import { Types } from 'mongoose';

// Безопасный телефонный regexp (без вложенных квантификаторов)
export const phoneRegExp =
  /^\+?\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/;

export enum PaymentType {
  Card = 'card',
  Online = 'online',
}

export const validateOrderBody = celebrate({
  body: Joi.object().keys({
    items: Joi.array()
      .items(
        Joi.string().custom((value, helpers) => {
          if (Types.ObjectId.isValid(value)) {
            return value;
          }
          return helpers.message({ custom: 'Невалидный id' });
        })
      )
      .min(1)
      .required()
      .messages({ 'array.empty': 'Не указаны товары' }),
    payment: Joi.string()
      .valid(...Object.values(PaymentType))
      .required()
      .messages({
        'string.valid':
          'Указано не валидное значение для способа оплаты, возможные значения - "card", "online"',
        'string.empty': 'Не указан способ оплаты',
      }),
    email: Joi.string().email().max(254).required().messages({
      'string.empty': 'Не указан email',
    }),
    phone: Joi.string().pattern(phoneRegExp).max(20).required().messages({
      'string.empty': 'Не указан телефон',
    }),
    address: Joi.string().max(500).required().messages({
      'string.empty': 'Не указан адрес',
    }),
    total: Joi.number().min(0).required().messages({
      'string.empty': 'Не указана сумма заказа',
    }),
    comment: Joi.string().max(1000).optional().allow(''),
  }),
});

export const validateProductBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string().required().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
      'string.empty': 'Поле "title" должно быть заполнено',
    }),
    image: Joi.object().keys({
      fileName: Joi.string().max(255).required(),
      originalName: Joi.string().max(255).required(),
    }),
    category: Joi.string().max(50).required().messages({
      'string.empty': 'Поле "category" должно быть заполнено',
    }),
    description: Joi.string().max(1000).required().messages({
      'string.empty': 'Поле "description" должно быть заполнено',
    }),
    price: Joi.number().min(0).allow(null),
  }),
});

export const validateProductUpdateBody = celebrate({
  body: Joi.object().keys({
    title: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    image: Joi.object().keys({
      fileName: Joi.string().max(255).required(),
      originalName: Joi.string().max(255).required(),
    }),
    category: Joi.string().max(50),
    description: Joi.string().max(1000),
    price: Joi.number().min(0).allow(null),
  }),
});

export const validateObjId = celebrate({
  params: Joi.object().keys({
    productId: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (Types.ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message({ any: 'Невалидный id' });
      }),
  }),
});

export const validateUserBody = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      'string.min': 'Минимальная длина поля "name" - 2',
      'string.max': 'Максимальная длина поля "name" - 30',
    }),
    password: Joi.string().min(6).max(128).required().messages({
      'string.empty': 'Поле "password" должно быть заполнено',
    }),
  }),
});

import { Router } from 'express';
import {
  deleteCustomer,
  getCustomerById,
  getCustomers,
  updateCustomer,
} from '../controllers/customers';
import auth, { roleGuardMiddleware } from '../middlewares/auth';
import { validateCustomerQuery } from '../middlewares/validations'; // <--- 1. Добавили импорт
import { Role } from '../models/user';

const customerRouter = Router();

// 2. Добавили validateCustomerQuery в цепочку middleware
customerRouter.get(
  '/', 
  auth, 
  roleGuardMiddleware(Role.Admin), 
  validateCustomerQuery, 
  getCustomers
);

customerRouter.get(
  '/:id',
  auth,
  roleGuardMiddleware(Role.Admin),
  getCustomerById
);
customerRouter.patch(
  '/:id',
  auth,
  roleGuardMiddleware(Role.Admin),
  updateCustomer
);
customerRouter.delete(
  '/:id',
  auth,
  roleGuardMiddleware(Role.Admin),
  deleteCustomer
);

export default customerRouter;

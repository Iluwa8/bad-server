import { Router } from 'express'
import {
    createProduct,
    deleteProduct,
    getProducts,
    updateProduct,
    uploadFile, 
} from '../controllers/products'
import auth, { roleGuardMiddleware } from '../middlewares/auth'
import upload from '../middlewares/file' 
import {
    validateObjId,
    validateProductBody,
    validateProductUpdateBody,
} from '../middlewares/validations'
import { Role } from '../models/user'

const productRouter = Router()

productRouter.get('/', getProducts)

// 3. ДОБАВЛЕН МАРШРУТ ЗАГРУЗКИ
productRouter.post(
    '/upload',
    auth,
    roleGuardMiddleware(Role.Admin),
    upload.single('file'), // multer должен ожидать поле 'file'
    uploadFile
)

productRouter.post(
    '/',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateProductBody,
    createProduct
)
productRouter.delete(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    deleteProduct
)
productRouter.patch(
    '/:productId',
    auth,
    roleGuardMiddleware(Role.Admin),
    validateObjId,
    validateProductUpdateBody,
    updateProduct
)

export default productRouter

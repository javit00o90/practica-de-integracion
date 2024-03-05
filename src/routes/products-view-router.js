import express from 'express';
const router = express.Router();
import ProductsController from '../controller/productsController.js';
import auth from '../middleware/authenticate.js'
import { premiumAccessMiddleware } from '../middleware/access.js';

router.get('/', auth,  ProductsController.productView);
router.get('/premium', auth,  premiumAccessMiddleware, ProductsController.productPremiumView);
router.put('/premium/:pid/restore', auth, premiumAccessMiddleware, ProductsController.productRestore);


export default router;
import express from 'express';
import authRoutes from './auth.js';
import walletRoutes from './wallet.js';
import productRoutes from './product.js';

const router = express.Router();

//Routes
router.use(authRoutes);
router.use(walletRoutes);
router.use(productRoutes);

export default router;

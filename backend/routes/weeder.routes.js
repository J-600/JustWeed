import express from 'express';

import { addWeeder, updateProduct, viewAndamento, viewProducts, deleteProduct, uploadProduct } from '../controllers/weeder.controller.js';
import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/add-weeder", protectRoute, addWeeder)
router.post("/products/upload", protectRoute, uploadProduct)
router.put("/products/:id", protectRoute, updateProduct)
router.get("/progress", protectRoute, viewAndamento)
router.get("/products", protectRoute, viewProducts)
router.delete("/products/:id", protectRoute, deleteProduct)


export default router
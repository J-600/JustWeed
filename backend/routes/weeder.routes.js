import express from 'express';

import { addWeeder, updateProduct, viewAndamento, viewProducts, deleteProduct } from '../controllers/weeder.controller.js';
import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/add-weeder", protectRoute, addWeeder)
router.get("/progress", protectRoute, viewAndamento)
router.get("/products", protectRoute, viewProducts)
router.put("/products/:id", protectRoute, updateProduct)
router.delete("/products/:id", protectRoute, deleteProduct)

export default router
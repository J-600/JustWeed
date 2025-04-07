import express from 'express';
import { 
  viewCart, 
  updateProducts, 
  addComment, 
  comments, 
  insertCart, 
  product, 
  products, 
  tag, 
  updateCart, 
  viewPurchase, 
  viewTags,
  trackProduct
} from '../controllers/products.controller.js';

import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();


router.post("/insert-cart", protectRoute, insertCart)
router.post("/update-cart", protectRoute, updateCart)
router.post("/product", protectRoute, product)
router.post("/tag", protectRoute, tag)
router.post("/comments", protectRoute, comments)
router.post("/add-comment", protectRoute, addComment)
router.post("/updateProducts", protectRoute, updateProducts)
router.post("/tracking", protectRoute, trackProduct)

router.get("/view-purchase", protectRoute, viewPurchase)
router.get("/view-cart", protectRoute, viewCart)
router.get("/products", protectRoute, products)
router.get("/view-tags",  protectRoute, viewTags)

export default router
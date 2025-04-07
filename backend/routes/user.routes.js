import express from 'express';
import { 
  updateAddress, 
  accountInfo, 
  addAddress, 
  addCard, 
  addresses, 
  cardsdata, 
  deleteAddress, 
  deleteCard, 
  deleteUser, 
  updateCard, 
  updateData, 
  verifyCard,
  buyProduct,
} from '../controllers/user.controller.js';

import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/updateData", protectRoute, updateData)
router.post("/add-address", protectRoute, addAddress)
router.post("/update-address", protectRoute, updateAddress)
router.post("/delete-address", protectRoute, deleteAddress)
router.post("/verify-card", protectRoute, verifyCard)
router.post("/add-card", protectRoute, addCard)
router.post("/update-card", protectRoute, updateCard)
router.post("/delete-card", protectRoute, deleteCard)
router.post("/buy", protectRoute, buyProduct)
router.post("/delete-user", protectRoute, deleteUser)


router.get("/addresses", protectRoute, addresses)
router.get("/cardsdata", protectRoute, cardsdata)
router.get("/account-info", protectRoute, accountInfo)


export default router
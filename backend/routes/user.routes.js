const express = require('express');

import { updateAddress, accountInfo, addAddress, addCard, addresses, becomeAseller, cardsdata, deleteAddress, deleteCard, deleteUser, updateCard, updateData, verifyCard } from '../controllers/user.controller';
import { protectRoute } from '../middleware/protectroute.middleware';

const router = express.Router();

router.post("/updateData", protectRoute, updateData)
router.post("/add-address", protectRoute, addAddress)
router.post("/update-address", protectRoute, updateAddress)
router.post("/delete-address", protectRoute, deleteAddress)
router.post("/verify-card", protectRoute, verifyCard)
router.post("/add-card", protectRoute, addCard)
router.post("/update-card", protectRoute, updateCard)
router.post("/delete-card", protectRoute, deleteCard)
router.post("/becomeAseller", protectRoute, becomeAseller)

router.get("/addresses", protectRoute, addresses)
router.get("/cardsdata", protectRoute, cardsdata)
router.get("/account-info", protectRoute, accountInfo)
router.get("/delete-user", protectRoute, deleteUser)

export default router
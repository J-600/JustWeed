import express from 'express';

import { addWeeder, viewAndamento } from '../controllers/weeder.controller.js';
import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/add-weeder", protectRoute, addWeeder)
router.get("/progress", protectRoute, viewAndamento)

export default router
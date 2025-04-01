import express from "express";
import { signUp, login, logout, confirm, forgotpassword, newpassword, session } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/login", login)
router.get("/logout", protectRoute, logout)
router.get("/confirm", confirm)
router.post("/signup", signUp)
router.post("/forgotpassword", forgotpassword)
router.post("/newpassword", protectRoute, newpassword)
router.get("/session", protectRoute, session)


export default router
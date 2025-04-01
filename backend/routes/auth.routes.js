import express from "express";
import { signUp, login, logout, confirm, forgotpassword, newpassword } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectroute.middleware.js';

const router = express.Router();

router.post("/login", login)
router.get("/logout", protectRoute, logout)
router.get("/confirm", confirm)
router.post("/signup", signUp)
router.post("/forgotpassword", forgotpassword)
router.post("/newpassword", newpassword)
router.get("/session", protectRoute)


export default router
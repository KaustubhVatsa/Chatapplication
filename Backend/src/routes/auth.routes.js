import express from "express"
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectedRoute } from "../middleware/auth.middlewares.js";

const router = express.Router();

router.post("/signup",signup);


router.post("/login",login);


router.post("/logout",logout);

router.put("/updateProfile", protectedRoute, updateProfile);

router.get("/profile",protectedRoute, checkAuth)

export default router;
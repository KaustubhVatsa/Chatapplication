import express from "express";
import { contactListforSidebar, getChatMessage, sendMessage } from "../controllers/message.controller.js";
import { protectedRoute } from "../middleware/auth.middlewares.js";

const router = express.Router();

router.get("/contactList",protectedRoute,contactListforSidebar);

router.get("/:id",protectedRoute,getChatMessage);

router.post("/send/:id",protectedRoute,sendMessage);
export default router;


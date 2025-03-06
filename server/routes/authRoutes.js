import express from "express";
import { register, login, logout,getAllStudents,deleteUser } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", getAllStudents)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", authMiddleware, logout);
router.delete("/delete/:id", authMiddleware, deleteUser);

export default router;

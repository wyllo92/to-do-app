import { Router } from "express";
import AuthController from '../controller/auth.controller.js';
import { verifyToken } from '../middleware/authMiddleware.js'
const router = Router();

router.post('/auth/register', verifyToken, AuthController.register);
router.post('/auth/login', AuthController.login);

export default router;
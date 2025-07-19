import { Router } from "express";
import EmailController from '../controller/email.controller.js';
// Importing the verifyToken middleware to protect routes

import { verifyToken } from '../middleware/authMiddleware.js';
const router = Router();
const name = '/send-welcome';

router.post(name, verifyToken, async (req, res) => {
    try {
        await EmailController.sendWelcomeEmail(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;







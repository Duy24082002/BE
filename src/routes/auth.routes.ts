import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { signupValidation, loginValidation } from '../middleware/validation.middleware';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/signup', signupValidation, authController.signup);
router.post('/login', loginValidation, authController.login);

export default router; 
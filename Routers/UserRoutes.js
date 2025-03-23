import express from 'express';
const router = express.Router();
import authMiddleware from '../Middleware/Auth.js';
import { registerUser, loginUser, createPost, getAllPosts } from '../Conntrollers/userController.js';

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/upload', authMiddleware, createPost);
router.get('/feed', authMiddleware, getAllPosts);

export default router;
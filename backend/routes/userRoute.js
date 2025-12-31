import express from "express";
import { getCurrentUser, loginUser, registerUser, updatePassword, updateProfile } from "../controllers/userControllers.js";
import authMiddleware from "../middleware/auth.js";

const userRouter = express.Router();

//PUBLIC Links

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);

//Private Links
userRouter.get('/me',authMiddleware, getCurrentUser);
userRouter.put('/profile',authMiddleware, updateProfile);
userRouter.put('/password',authMiddleware, updatePassword);

export default userRouter;
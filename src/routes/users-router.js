import express from 'express';
import auth from '../middleware/authenticate.js';
import UserController from '../controller/userController.js';
const router = express.Router();


router.get('/premium/:uid', auth, UserController.premiumGet);
router.post('/premium/:uid', auth, UserController.premiumPost);
router.post("/passwordreset", UserController.passwordReset)
router.get("/passwordreset2", UserController.passwordReset2)
router.post("/passwordreset3", UserController.passwordReset3)

export default router;
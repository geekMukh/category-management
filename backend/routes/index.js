import express from "express";
const router = express.Router();
import Auth from "./auth.js"
import Action from "./action.js"
import { userAuthenticated } from "../middleware/auth.js";

router.use('/auth', Auth);
router.use('/action', userAuthenticated, Action);


export default router;
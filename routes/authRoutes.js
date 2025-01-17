import express from "express";
import { getPaginatedRecords, loginUser } from "../controller/authController.js";
const router = express.Router();

router.post('/login', loginUser);
router.get('/records', getPaginatedRecords);

export default router;
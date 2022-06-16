import { Router } from "express";
import { createMember } from './../controllers/memberController';

const router = Router();

router.route('/').post(createMember);

export default router;

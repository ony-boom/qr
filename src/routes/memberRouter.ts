import { Router } from "express";
import {
  createMember,
  checkBody,
  updateMemberPoints,
  checkQuery,
  getMember,
} from "../controllers/memberController";

const router = Router();

router
  .route("/")
  .get(checkQuery, getMember)
  .post(checkBody, createMember)
  .put(checkBody, updateMemberPoints);
export default router;

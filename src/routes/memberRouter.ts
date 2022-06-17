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
  .post(checkBody, createMember)
  .put(checkBody, updateMemberPoints);

router.get("/:id", checkQuery, getMember);
export default router;

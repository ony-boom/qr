import { Router } from "express";
import {
  createMember,
  checkBody,
  updateMemberPoints,
  checkQuery,
  getMember,
  validate,
  getAllMember
} from "../controllers/memberController";

const router = Router();

router
  .route("/")
  .post(checkBody, createMember)
  .put( checkBody, validate, updateMemberPoints)
  .get(getAllMember);

router.get("/:email", checkQuery, validate, getMember);

export default router;

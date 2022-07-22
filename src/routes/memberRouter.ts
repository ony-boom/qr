import { Router } from "express";
import {
  createMember,
  updateMemberPoints,
  checkQuery,
  getMember,
  validate,
  getAllMember,
} from "../controllers/memberController";

const router = Router();

router
  .route("/")
  .post(createMember)
  .put(validate, updateMemberPoints)
  .get(getAllMember);

router.get("/:email", checkQuery, validate, getMember);

export default router;

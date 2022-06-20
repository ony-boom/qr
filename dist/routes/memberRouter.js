"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const memberController_1 = require("../controllers/memberController");
const router = (0, express_1.Router)();
router
    .route("/")
    .post(memberController_1.checkBody, memberController_1.createMember)
    .put(memberController_1.checkBody, memberController_1.validate, memberController_1.updateMemberPoints);
router.get("/:email", memberController_1.checkQuery, memberController_1.validate, memberController_1.getMember);
exports.default = router;

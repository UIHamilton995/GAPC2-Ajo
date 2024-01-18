import express from "express";
import { forgetPassword, resetPasswordGet, resetPasswordPost } from "../controller/authController";


const router =express.Router();

router.route("/forgotpassword").post(forgetPassword);
router.route("/reset-password/:id/:token").get(resetPasswordGet); 
router.route("/reset-password/:id/:token").post(resetPasswordPost);
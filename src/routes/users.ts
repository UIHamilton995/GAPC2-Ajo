import express from "express";
import { forgetPassword, resetPasswordGet, resetPasswordPost, signup,login } from "../controller/authController";
import {
    createGroup, getGroups, 
    getGroup, getGroupTotalSavings,
    getPersonalSavings, createSavings,
    createWallet, getTotalIncome, getTransactionHistory,
    getUserContributions, getUserGoals,updatedWallet
     } from "../controller/userController";
import { auth } from "../middleware/authorization";


const router =express.Router();


router.post('/signup', signup);
router.post('/login', login);
router.route("/forgotpassword").post(forgetPassword);
router.route("/reset-password/:id/:token").get(resetPasswordGet); 
router.route("/reset-password/:id/:token").post(resetPasswordPost);

router.route('/create-group').post(auth, createGroup);
router.route('/get-groups').get(auth, getGroups);
router.route('/get-group/:groupId').get(auth, getGroup);

router.route('/create-savings').post(auth, createSavings);
router.route('/get-groupsavings/:groupId').get(auth, getGroupTotalSavings);
router.route('/get-personalsavings/:groupId').get(auth, getPersonalSavings);
router.route('/get-totalincome').get(auth, getTotalIncome);
router.route('/get-transaction-history').get(auth, getTransactionHistory);
router.route('/get-user-contributions').get(auth, getUserContributions);
router.route('/get-user-goals').get(auth, getUserGoals);
router.route('/update-wallet').put(auth, updatedWallet);

router.route('/create-wallets').post(auth, createWallet);  

export default router;









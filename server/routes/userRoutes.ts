import express from "express";
import authCtrlr from "../controllers/authController";
import userCtrlr from "../controllers/userController";
import { protect } from "../middlewares/authMiddleware";

const router = express.Router();

router.post("/signup", authCtrlr.signup);
router.post("/login", authCtrlr.login);
router.post("/logout", authCtrlr.logout);

router.route("/").get(userCtrlr.getAllUsers);

router.get("/getMe", protect, userCtrlr.getMe);

router.route("/:id").get(userCtrlr.getUser).delete(userCtrlr.deleteUser);

router.route("/:id/tasks").get(userCtrlr.getTasksByUser);

export default router;

import { Router } from "express";
import healthRoute from "../api/health/health.route";
import authRoute from "../api/auth/auth.route";
import userRoute from "../api/user/user.route";
import noteRoute from "../api/note/note.route";

const router: Router = Router();

router.use("/health", healthRoute);
router.use("/auth", authRoute);
router.use("/user", userRoute);
router.use("/note", noteRoute);

export default router;

import { Router } from "express";
import healthRoute from "../api/v1/health/health.route";

const router: Router = Router();

router.use("/health", healthRoute);

export default router;

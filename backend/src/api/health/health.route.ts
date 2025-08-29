import { Router } from "express";
import { health } from "./health.controller";

const router: Router = Router();

router.get("/", health);

export default router;

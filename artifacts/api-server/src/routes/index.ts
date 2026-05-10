import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import openaiRouter from "./openai";

const router: IRouter = Router();

router.use(healthRouter);
router.use(toolsRouter);
router.use(openaiRouter);

export default router;

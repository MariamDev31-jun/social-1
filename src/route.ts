
import { Router } from "express";
import { authRouter } from "./app/auth/route";
import { userRouter } from "./app/user/route";

export const router = Router();

router.use("/auth", authRouter);
router.use("/user", userRouter);

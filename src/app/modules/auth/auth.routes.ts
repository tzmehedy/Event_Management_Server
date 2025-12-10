import { Router } from "express";
import { authControllers } from "./auth.controllers";

const router = Router()

router.post("/login", authControllers.credentialsLogin)
router.post("/logout", authControllers.logOut)

export const authRoutes = router
import express from "express";
import {PrismaClient} from "@prisma/client";
import {UserController} from "../controller/user-controller";

export const publicRouter = express.Router();

publicRouter.get("/api/health", async (req, res) => {
    const prisma = new PrismaClient();
    let dbStatus = "ok";
    try {
        await prisma.$queryRaw`SELECT 1`;
    } catch {
        dbStatus = "error";
    } finally {
        await prisma.$disconnect();
    }

    res.json({
        app: "belajar-typescript-restful-api",
        status: "running",
        port: process.env.PORT || 8888,
        database: dbStatus,
        version: "2.0.0",
        timestamp: new Date().toISOString()
    });
});

publicRouter.post("/api/users", UserController.register);
publicRouter.post("/api/users/login", UserController.login);

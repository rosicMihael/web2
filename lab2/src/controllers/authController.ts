import { Request, Response } from "express";
import { Login, SqlInjection } from "../services/authService.ts";

export async function login(req: Request, res: Response) {
    const { username, password, sql_vulnerable, broken_auth_vulnerable } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    try {
        if (sql_vulnerable) {
            const {query, result, is_successful} = await SqlInjection(username, password);

            if (is_successful) {
                return res.status(200).json({ message: "Login successful", query, result });
            }

            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!broken_auth_vulnerable || !sql_vulnerable) {
            const isAuthenticated = await Login(username, password);

            if (isAuthenticated) {
                return res.status(200).json({ message: "Login successful" });
            }

            return res.status(401).json({ message: "Invalid credentials" });
        }

    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
import { Request, Response } from "express";
import {
  getAllPassesService,
  getPassCountsService,
} from "../services/passService.js";

export async function getHome(req: Request, res: Response) {
  try {
    const counts = await getPassCountsService();

    res.render("index", {
      totalPasses: counts.total,
      activePasses: counts.active,
    });
  } catch (error) {
    console.error("Greška pri dohvaćanju broja propusnica:", error);
    res.status(500).send("Interna greška poslužitelja");
  }
}

export function getPrivate(req: Request, res: Response) {
  const user = JSON.stringify(req.oidc.user);
  res.render("private", { user });
}

export async function getAllPassesPage(req: Request, res: Response) {
  const passes = await getAllPassesService();
  res.render("passes", { passes });
}

export function logout(req: Request, res: Response) {
  res.oidc.logout();
}

export function signUp(req: Request, res: Response) {
  res.oidc.login({
    returnTo: "/",
    authorizationParams: {
      screen_hint: "signup",
    },
  });
}

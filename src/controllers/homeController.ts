import { Request, Response } from "express";
import {
  getAllPassesService,
  getPassCountsService,
  getPassByIdService,
} from "../services/passService.js";

export async function getHome(req: Request, res: Response) {
  const counts = await getPassCountsService();
  let username: string | undefined;
  if (req.oidc.isAuthenticated()) {
    username = req.oidc.user?.name ?? req.oidc.user?.sub;
  }

  res.render("index", {
    totalPasses: counts.total,
    activePasses: counts.active,
    username,
  });
}

export function getPrivate(req: Request, res: Response) {
  const user = JSON.stringify(req.oidc.user);

  res.render("private", { user });
}

export async function getAllPassesPage(req: Request, res: Response) {
  const passes = await getAllPassesService();

  res.render("passes", { passes });
}

export async function getPassInfoPage(req: Request, res: Response) {
  const passId = parseInt(String(req.params.id), 10);
  if (isNaN(passId)) {
    return res.status(400).send("Invalid pass id");
  }
  const pass = await getPassByIdService(passId);

  res.render("pass_info", { pass });
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

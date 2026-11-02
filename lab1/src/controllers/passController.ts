import { Request, Response } from "express";
import {
  getPassByIdService,
  createPassService,
  deletePassService,
  cancelPassService,
} from "../services/passService.js";
import QRCode from "qrcode";

export async function getPass(req: Request, res: Response) {
  const passId = parseInt(String(req.params.id), 10);
  if (isNaN(passId)) {
    return res.status(400).json({ message: "Invalid pass id" });
  }
  const pass = await getPassByIdService(passId);
  if (!pass) {
    return res
      .status(404)
      .json({ message: "Pass with this id does not exist" });
  }

  res.json(pass);
}

export async function createPass(req: Request, res: Response) {
  const { name, document } = req.body;
  if (!name || !document) {
    return res.status(400).json({ message: "Name and document are required" });
  }
  const newPass = await createPassService(name, document);
  const baseURL = process.env.BASE_URL;
  const publicURL = `${baseURL}/info/${newPass.id}`;
  const apiURL = `${baseURL}/api/passes/${newPass.id}`;
  const qrImage = await QRCode.toBuffer(publicURL, {
    type: "png",
  });

  res.status(201).location(apiURL).type("png").send(qrImage);
}

export async function deletePass(req: Request, res: Response) {
  const passId = parseInt(String(req.params.id), 10);
  if (isNaN(passId)) {
    return res.status(400).send("Invalid pass id");
  }
  const deleted = await deletePassService(passId);
  if (!deleted) {
    return res.status(404).send("Pass with this id does not exist");
  }

  res.redirect("/passes");
}

export async function cancelPass(req: Request, res: Response) {
  const passId = parseInt(String(req.params.id), 10);
  if (isNaN(passId)) {
    return res.status(400).send("Invalid pass id");
  }
  const cancelled = await cancelPassService(passId);
  if (!cancelled) {
    return res.status(404).send("Pass with this id does not exist");
  }

  res.redirect("/passes");
}

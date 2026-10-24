import { Request, Response } from 'express';

export function logout(req: Request, res: Response) {
    res.oidc.logout();
}

export function signUp(req: Request, res: Response) {
    res.oidc.login({
    returnTo: '/',
    authorizationParams: {      
      screen_hint: "signup",
    },
  });
};
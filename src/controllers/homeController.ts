import { Request, Response } from 'express';
import { getPassCounts } from '../services/passService.js';

export async function getHome(req: Request, res: Response) {
    try {
        const counts = await getPassCounts();

        res.render('index', {
            totalPasses: counts.total,
            activePasses: counts.active,
        });
    } catch (error) {
        console.error('Greška pri dohvaćanju broja propusnica:', error);
        res.status(500).send('Interna greška poslužitelja');
    }
}

export function getPrivate(req: Request, res: Response) {
    const user = JSON.stringify(req.oidc.user);      
    res.render('private', {user}); 
}
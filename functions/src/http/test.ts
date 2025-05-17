import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
import { getAuth } from 'firebase-admin/auth';
const auth = getAuth(app);

function test(req: Request, res: Response) {
    auth.verifyIdToken(req.headers["authorization"]?.split(" ")[1] || "")
    .then((decodedToken) => {
        res.json({message: "ok", user: decodedToken });
    }).catch((error) => {
        res.json({message: "ok", user: error});
    });
}

export {test}
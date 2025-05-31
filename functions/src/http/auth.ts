import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
import { getAuth } from 'firebase-admin/auth';
const auth = getAuth(app);

// firestoreの利用
// import { getFirestore } from 'firebase-admin/firestore';
// const db = getFirestore(app);

// 認証済みのリクエストかをチェックするミドルウェア
export async function authMiddleware(req: Request, res: Response, next: Function) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '認証トークンが必要です。' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        return req.user = decodedToken; //user情報をリクエストに追加
        next(); 
    } catch (error) {
        console.error('認証エラー:', error);
        return res.status(401).json({ error: '無効な認証トークンです。' });
    }
}

// function signup(req: Request, res: Response) {

// }

// function login(req: Request, res: Response) {

// }

// export {signup, login}
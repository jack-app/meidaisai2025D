import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
import { getAuth } from 'firebase-admin/auth';
const auth = getAuth(app);

// 認証済みのリクエストかをチェックするミドルウェア
export async function authMiddleware(req: Request, res: Response, next: Function) {
    console.log('authMiddleware called');
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: '認証トークンが必要です。' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; //user情報をリクエストに追加
        return next(); 
    } catch (error) {
        console.error('認証エラー:', error);
        return res.status(401).json({ error: '無効な認証トークンです。' });
    }
}

// 開発環境向けにクロス-オリジンリクエストを許可するミドルウェア
export async function allowCors(req: Request, res: Response, next: Function) {
    // ローカルホストの場合全てのポートを許可
    console.log(`allowing cors access. origin: ${req.headers.origin} host: ${req.headers.host}`);

    if (
        req.headers.host?.includes('127.0.0.1') 
        || req.headers.host?.includes('localhost') 
        || req.headers.origin?.includes('metype-ffe25.web.app') 
        || req.headers.origin?.includes('metype-ffe25.firebaseapp.com')
    ) {
        res.header('Access-Control-Allow-Origin', req.headers.origin);
    }
    
    res.vary('Origin');

    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    res.header('Vary', 'Origin');
    
    return next();
}

import { SourceCode } from "./problems";

export default [
new SourceCode(
"functions_index",
`
/* ----------------------------
HttpFunctionsを設定
---------------------------- */

// ルータとしてexpressを使用
// ルータ: URL（エンドポイント）に基づいて返すレスポンスを決定するもの．
import express from "express";
const app = express();

// ルーティングをインポートす
import api from "./http/api";
api(app);

// 未設定のルートにアクセスした際の振る舞いを設定する
app.use((req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

// Firebase Functionsのデプロイ設定
import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

setGlobalOptions({region: "asia-northeast1"});
export const appFunction = onRequest(app);

/* ----------------------------
Background Functionsを設定
---------------------------- */
`,
"typescript",
),
new SourceCode(
"functions_middleware",
`import type { Request, Response } from 'express';
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
    console.log('allowing cors access');
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    
    return next();
}`,
"typescript",
),
new SourceCode(
"functions_api_prepare",
`import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
// import { getAuth } from 'firebase-admin/auth';
// const auth = getAuth(app);

// firestoreの利用
import { getFirestore } from 'firebase-admin/firestore';
const db = getFirestore(app);

// 各種関数定義

export {getUserData, setUserData, addGameRecord, getLatestGameRecords};`,
"typescript",
),
new SourceCode(
"functions_api",
`async function getUserData(req: Request, res: Response) {
    console.log('getUserData called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(200).json({
                setting: {
                    timeLimitPresentation: true,
                    BGM: true,
                    typingSound: true,
                    otherSoundEffect: true
                },
                records: {
                    totalTypeByte: 0,
                    bestWPM: 0
                }
            });
        }

        return res.status(200).json(userDoc.data());
    } catch (error) {
        console.error('ユーザーデータの取得エラー:', error);
        return res.status(500).json({ error: 'ユーザーデータの取得に失敗しました。' });
    }
}`,
"typescript",
),
new SourceCode(
"functions_api",
`

async function setUserData(req: Request, res: Response) {
    console.log('setUserData called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }
        
        const { setting, records } = req.body;

        const updateData: any = {};

        if (setting) {
            updateData.setting = setting;
        }

        if (records) {
            updateData.records = records;
        }

        await db.collection('users').doc(userId).set(updateData, { merge: true });

        return res.status(200).json({ success: true });
    } catch (error) {
        console.error('ユーザーデータの更新エラー:', error);
        return res.status(500).json({ error: 'ユーザーデータの更新に失敗しました。' });
    }    
}`,
"typescript",
),
new SourceCode(
"functions_api",
`async function addGameRecord(req: Request, res: Response) {
    console.log('addGameRecord called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const gameRecord = req.body;

        const recordWithTimestamp = {
            ...gameRecord,
            recordedAt: new Date()
        };

        const recordRef = await db.collection('users').doc(userId).collection('gameRecords').add(recordWithTimestamp);

        const userRef = db.collection('users').doc(userId);
        let totalTypeByte, bestWPM;

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data() || {};
            const currentRecords = userData.records || { totalTypeByte: 0, bestWPM: 0 };

            totalTypeByte = (currentRecords.totalTypeByte || 0) + gameRecord.correctTypes;
            const byte = gameRecord.correctTypes;
            bestWPM = Math.max(currentRecords.bestWPM || 0, byte);

            transaction.set(userRef, {
                records: {
                    totalTypeByte,
                    bestWPM
                }
            }, { merge: true });
        });

        return res.status(200).json({
            success: true,
            recordId: recordRef.id,
            totalTypeByte,
            bestWPM
        });
    } catch (error) {
        console.error('ゲーム記録の追加エラー:', error);
        return res.status(500).json({ error: 'ゲーム記録の追加に失敗しました。' });
    }
}`,
"typescript",
),
new SourceCode(
"functions_api",
`

async function getLatestGameRecords(req: Request, res: Response) {
    console.log('getLatestGameRecords called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'ユーザー認証が必要です。' });
        }

        const recordsSnapshot = await db.collection('users').doc(userId).collection('gameRecords')
            .orderBy('recordedAt', 'desc')
            .limit(1)
            .get();

        if (recordsSnapshot.empty) {
            return res.status(404).json({ error: 'ゲーム記録が見つかりません。' });
        }
        
        const latestRecord = recordsSnapshot.docs[0].data();
        return res.status(200).json(latestRecord);
    } catch (error) {
        console.error('最新のゲーム記録の取得エラー:', error);
        return res.status(500).json({ error: '最新のゲーム記録の取得に失敗しました。' });
    }
}`,
"typescript",
),
new SourceCode(
"functions_routing",
`/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

import { type Express } from 'express';

import { test } from "./test";
import { allowCors, authMiddleware } from "./auth";
import { getUserData, setUserData, addGameRecord, getLatestGameRecords} from "./userData";

export default function (app: Express) {
    // 接続テスト用エンドポイント
    app.get("/api/", test);

    // ユーザデータ取得用エンドポイント
    app.get("/api/user", allowCors, authMiddleware, getUserData);

    // ユーザデータ更新用エンドポイント
    app.post("/api/user", allowCors, authMiddleware, setUserData);

    //ゲーム記録保存用エンドポイント
    app.post("/api/records", allowCors, authMiddleware, addGameRecord);

    //最新のゲーム記録取得用エンドポイント
    app.get("/api/records/latest", allowCors, authMiddleware, getLatestGameRecords);
}`,
"typescript",
)
]
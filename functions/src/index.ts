// firebaseの初期化
import { initializeApp } from "firebase-admin/app";
initializeApp({
  projectId: "metype-ffe25"
});

// ルータとしてexpressを使用
// ルータ: URL（エンドポイント）に基づいて返すレスポンスを決定するもの．
import express from "express";
const app = express();

// ルーティングをインポートする
import web from "./web";
import api from "./api";

web(app);
api(app);

/* ----------------------------
未設定のルートにアクセスした際の振る舞いを設定する
------------------------------- */
app.use((req, res, next) => {
  res.status(404).send('<h1>404 Not Found</h1>')
})

// Firebase Functionsのデプロイ設定
import { setGlobalOptions } from "firebase-functions";
import { onRequest } from "firebase-functions/v2/https";

setGlobalOptions({region: "asia-northeast1"});
export const appFunction = onRequest(app);

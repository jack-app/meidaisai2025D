/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as logger from "firebase-functions/logger";

// ルータとしてexpressを使用
// ルータ: URL（エンドポイント）に基づいて返すレスポンスを決定するもの．
import express from "express";

// Webページのエンドポイント
const app = express();

app.get("/", (req, res)=> {
    logger.log("Accessing the game page.");
    res.send("You are successfully accessing the game Page.");
})

app.get("/api/", (req, res)=> {
    logger.log("Accessing the game api.");
    res.send("You are successfully accessing the game API.");
})

// Firebase Functionsのデプロイ設定
import {onRequest} from "firebase-functions/v2/https";

export const appFunction = onRequest( // プログラムを東京で作動させる
    {region: "asia-northeast1"},
    app
);

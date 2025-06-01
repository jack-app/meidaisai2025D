/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

import { type Express } from 'express';

import { test } from "./test";
import { allowCors, authMiddleware } from "./auth";
import { getUserData, setUserData, addGameRecord, getLatestGameRecords} from "./userData";

export default function (app: Express) {
    // 接続テスト用エンドポイント
    app.get("/api/", test);

    // // ユーザ登録用エンドポイント
    // app.post("/api/signup", signup);

    // // ユーザ認証用エンドポイント
    // app.post("/api/login", login);

    // ユーザデータ取得用エンドポイント
    app.get("/api/user", allowCors, authMiddleware, getUserData);

    // ユーザデータ更新用エンドポイント
    app.post("/api/user", allowCors, authMiddleware, setUserData);

    //ゲーム記録保存用エンドポイント
    app.post("/api/records", allowCors, authMiddleware, addGameRecord);

    //最新のゲーム記録取得用エンドポイント
    app.get("/api/records/latest", allowCors, authMiddleware, getLatestGameRecords);
}
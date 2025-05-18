/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

import { type Express } from 'express';

import { test } from "./test";
import { signup, login } from "./auth";
import { getUserData, setUserData } from "./userData";

export default function (app: Express) {
    // 接続テスト用エンドポイント
    app.get("/api/", test)

    // ユーザ登録用エンドポイント
    app.post("/api/signup", signup)

    // ユーザ認証用エンドポイント
    app.post("/api/login", login)

    // ユーザデータ取得用エンドポイント
    app.get("/api/user", getUserData)

    // ユーザデータ更新用エンドポイント
    app.post("/api/user", setUserData)
}
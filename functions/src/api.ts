/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

// import * as logger from "firebase-functions/logger";
import { Express } from 'express';

// authの利用
import { getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
const app = getApp();
const auth = getAuth(app);

const apiPrefix = "/api";

export default function (app: Express) {
    // 接続テスト用エンドポイント
    app.get(apiPrefix+"/", (req, res)=> {
        auth.verifyIdToken(req.headers["authorization"]?.split(" ")[1] || "")
        .then((decodedToken) => {
            res.json({message: "ok", user: decodedToken });
        }).catch((error) => {
            res.json({message: "ok", user: error});
        });
    })
}
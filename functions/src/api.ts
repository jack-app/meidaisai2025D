/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

// import * as logger from "firebase-functions/logger";
import { Express } from 'express';

const apiPrefix = "/api";

export default function (app: Express) {
app.get(apiPrefix+"/", (req, res)=> {
    res.json({message: "ok"});
})
}
/* --------------------------------
動的Webページのルーティングを設定する
----------------------------------- */

import * as logger from "firebase-functions/logger";
import { Express } from 'express';

export default function (app: Express) {
    app.get("/", (req, res)=> {
        logger.log("Accessing the game page.");
        res.send("You are successfully accessing the game Page.");
    })
}
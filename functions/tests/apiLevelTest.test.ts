// 1. emulatorを起動する． (firebase emulators:start)
// 2. 本ファイルを実行する. (npx tsx test/apiLevelTest.script.ts)

/* -----------------------------------------------
Firebase FunctionsのAPIレベルテスト
----------------------------------------------- */

const localFunctionHost = "http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction/"

async function call(route: string) {
    return await fetch(localFunctionHost + route)
}

import { describe, test, expect } from "vitest";

describe("API Level Test", () => {
    test("/api", async () => {
        const response = await call("api");
        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json["message"]).toEqual("ok");
    });
});

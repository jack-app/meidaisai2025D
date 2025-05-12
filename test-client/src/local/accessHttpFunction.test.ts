// HttpFunctionのテスト時にはfirebaseライブラリを使用できない．
// そのためfetchAPIを使用してHTTPリクエストを投げてテストする．
const localHttpFunctionHost = "http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction/" // ポート番号は適宜変更すること
async function call(route: string) {
    return await fetch(localHttpFunctionHost + route)
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

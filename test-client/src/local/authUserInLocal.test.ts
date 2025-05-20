import { initializeApp } from "firebase/app";

const app = initializeApp({
    projectId: "demo-metype-ffe25",
    apiKey: "fake-api-key"
});

import { getAuth, signInAnonymously, connectAuthEmulator, updateCurrentUser } from "firebase/auth";
const auth = getAuth(app);
connectAuthEmulator(auth, "http://127.0.0.1:9099"); // ポート番号は適宜変更すること

// HttpFunctionのテスト時にはfirebaseライブラリを使用できない．
// そのためfetchAPIを使用してHTTPリクエストを投げてテストする．
const localHttpFunctionHost = "http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction/" // ポート番号は適宜変更すること
async function call(route: string) {
    return await fetch(
        `${localHttpFunctionHost}${route}`, 
        {
            headers: {
                Authorization: `Bearer ${await auth.currentUser?.getIdToken()}`
            }
        }
    );
}

import { describe, test, expect } from "vitest";

describe("auth Utility Test", () => {
    // https://firebase.google.com/docs/auth/web/anonymous-auth
    test("can sign in anonymously", async () => {
        const credential =  await signInAnonymously(auth);
        updateCurrentUser(auth, credential.user);
        expect(credential.user).toBeDefined();
    });

    test("information of user should be passed to functions", async () => {
        const response = await call("api");
        const content = await response.json()
        expect(content["user"]["uid"]).toEqual(auth.currentUser?.uid);
    });
});

// import { initializeApp } from "firebase/app";

// const app = initializeApp({
//     projectId: "demo-metype-ffe25"
// });

// // https://firebase.google.com/docs/firestore/query-data/queries?hl=ja
// import { getFirestore, collection, addDoc, getDocs, connectFirestoreEmulator, where, query} from "firebase/firestore";
// const db = getFirestore(app);
// connectFirestoreEmulator(db, "localhost", 8080); // ポート番号は適宜変更すること

import { describe, test } from "vitest";
// import { expect } from "vitest";
// import { v4 as UUID } from "uuid";

describe("firestore Access Test", () => {
    // フロントエンドからのアクセスをすべて拒否するように変更したため以下のテストは成功しない．

    // test("put/fetch a document", async () => {
    //     const testCollection = collection(db, "/testCollection");
    //     const uuid = UUID();
    //     await addDoc(testCollection, {id: uuid, field: "test"});
    //     const snapshot = await getDocs(
    //         query(
    //             testCollection, 
    //             where("id", "==", uuid)
    //         )
    //     );
    //     const data = snapshot.docs.map(doc => doc.data());
    //     expect(data.length).toBe(1);
    // });

    test("no test", () => {});
});
import { initializeApp } from "firebase/app";

const app = initializeApp({
    projectId: "metype-ffe25"
});

// https://firebase.google.com/docs/firestore/query-data/queries?hl=ja
import { getFirestore, collection, addDoc, getDocs, connectFirestoreEmulator, where, query} from "firebase/firestore";
const db = getFirestore(app);
connectFirestoreEmulator(db, "localhost", 8080); // ポート番号は適宜変更すること

import { describe, test, expect } from "vitest";
import { v4 as UUID } from "uuid";

describe("firestore Access Test", () => {
    test("put/fetch a document", async () => {
        const testCollection = collection(db, "/testCollection");
        const uuid = UUID();
        await addDoc(testCollection, {id: uuid, field: "test"});
        const snapshot = await getDocs(
            query(
                testCollection, 
                where("id", "==", uuid)
            )
        );
        const data = snapshot.docs.map(doc => doc.data());
        expect(data.length).toBe(1);
    });
});
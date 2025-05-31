import SceneManager from './scenes/fundation/sceneManager';
import type IUserDataManager from './data_interface/user_data/interface';
import type IGameDataProvider from './game_data/interface';
// import UserDataManager from './data_interface/user_data/userData';
// import GameDataProvider from './data_interface/game_data/gameData';
import UserDataManagerMock from './data_interface/user_data/mock';
import GameDataProviderMock from './game_data/mock';

const host = new URL(location.href).host

const isDev = 
    host.startsWith('localhost') 
    || host.startsWith('127.0.0.1') 
    || host.startsWith('::1')

if (isDev) {
    console.log('開発環境で実行しています．');
}

// Singleton
export const userDataManager: IUserDataManager = new UserDataManagerMock()
export const gameDataProvider: IGameDataProvider = new GameDataProviderMock()
export const sceneManager = new SceneManager()

// firebase
// authやfirestoreが必要な場合はconst.tsからインポートして使う．
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { initializeApp } from "firebase/app";

const firebaseApp = initializeApp(
    isDev 
    ? {
        projectId: "demo-metype-ffe25",
        apiKey: "fake-api-key"
    } 
    : {
        projectId: "metype-ffe25",
        apiKey: "AIzaSyA8p4gso3Jo2N00ABARjlBICy471S58PpU"
    }
);

export namespace Firebase {
    // これは使う．
    export const auth = getAuth(firebaseApp);

    // すべてのリクエストをfunctionsを経由するならフロントエンドでは使わない．
    export const db = getFirestore(firebaseApp);
    
    // つかわないかも. 普通にfetchAPIを使っていい．
    export const func = getFunctions(firebaseApp, "asia-northeast1"); 

    if (isDev) {
        connectFirestoreEmulator(db, "127.0.0.1", 8080); // ポート番号は適宜変更すること
        connectAuthEmulator(auth, "http://127.0.0.1:9099"); // ポート番号は適宜変更すること
        connectFunctionsEmulator(func, "127.0.0.1", 5001); // ポート番号は適宜変更すること
    }
}

// 定数
export namespace Host {
    export const functions = isDev 
        ? new URL('http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction')
        : new URL('https://metype-ffe25.web.app')

    export const hosting = isDev
        ? new URL('http://127.0.0.1:5000')
        : new URL('https://metype-ffe25.web.app')
}
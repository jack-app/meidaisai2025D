// import UserDataManager from './data_interface/user_data/userData';
// import GameDataProvider from './data_interface/game_data/gameData';
import SceneManager from './scenes/fundation/sceneManager';
import type IUserDataManager from './data_interface/user_data/interface';
import type IGameDataProvider from './data_interface/game_data/interface';
import UserDataManagerMock from './data_interface/user_data/mock';
import GameDataProviderMock from './data_interface/game_data/mock';

// Singleton
export const userDataManager: IUserDataManager = new UserDataManagerMock()
export const gameDataProvider: IGameDataProvider = new GameDataProviderMock()
export const sceneManager = new SceneManager()

// 定数
export namespace Host {
    const host = new URL(location.href).host

    const isDev = 
        host.startsWith('localhost') 
        || host.startsWith('127.0.0.1') 
        || host.startsWith('::1')

    export const functions = isDev 
        ? new URL('http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction')
        : new URL('https://metype-ffe25.web.app')

    export const hosting = isDev
        ? new URL('http://127.0.0.1:5000')
        : new URL('https://metype-ffe25.web.app')
}
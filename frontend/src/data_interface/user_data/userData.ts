import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, type User, signOut } from 'firebase/auth';
import { Host, Firebase } from '../../const';
import type IUserDataManager from './interface';
import { type GameStats, UserId, UserName, type RecordSummary, type UserSetting, type UserState } from './types';
import { createStore } from 'solid-js/store';


export default class UserDataManager implements IUserDataManager {
    // useUserState(): UserState {
    //     throw new Error('"useUserState"は開発段階でExampleSceneが動作するために用いるのみで，本番では使わない．');
    // }
    private userState: UserState = { isLoggedIn: false };
    private userSetting: UserSetting | null = null;
    private recordSummary: RecordSummary | null = null;
    private lastRecord: GameStats | null = null;
    private listeners: ((state: UserState) => void)[] = [];

    constructor() {
        //Firebaseの認証状態の監視
        onAuthStateChanged(Firebase.auth, (user) => {
            if(user) {
                this.updateUserState({
                    id: new UserId(user.uid),
                    name: new UserName(user.displayName || 'ゲスト'),
                    isLoggedIn: true,
                });
            } else {
                this.updateUserState({
                    isLoggedIn: false,
                });
            }
        });
    }

    // ユーザー状態の監視を登録
    private addUserStateListener(callback: (state: UserState) => void): void {
        this.listeners.push(callback);
        callback(this.userState);
    }

    // ユーザー状態を更新
    private updateUserState(state: UserState) {
        this.userState = state;
        this.listeners.forEach((listener) => listener(state));
    }

    private async fetchDataFromServer() {
        const token = await this.getAuthToken();
        if (!token) throw new Error('認証トークンの取得に失敗しました');

        const response = await fetch(
            `${Host.functions.href}/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('ユーザー設定の取得に失敗しました');
        }

        const data = await response.json();
        this.userSetting = data.setting ?? {
            timeLimitPresentation: true,
            BGM: true,
            typingSound: true,
            otherSoundEffect: true
        };
        this.recordSummary = data.records ?? {
            totalTypeByte: 0,
            bestWPM: 0
        };

        return {userSetting: this.userSetting!, recordSummary: this.recordSummary!};
    }

    // SolidJSのストアを使ってユーザー状態を提供
    useUserState() {
        const [state, setState] = createStore<UserState>(this.userState);
        this.addUserStateListener(setState);
        return state;
    }

    // Googleでサインイン
    async signInWithGoogle(): Promise<boolean> {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(Firebase.auth, provider);
            return true;
        } catch (error) {
            console.error('Googleサインインエラー:', error);
            return false;
        }
    }

    // サインアウト
    async signOut(): Promise<boolean> {
        try {
            await signOut(Firebase.auth);
            return true;
        } catch (error) {
            console.error('サインアウトエラー:', error);
            return false;
        }
    }

    // 認証トークンを取得
    async getAuthToken(): Promise<string | null> {
        const user = Firebase.auth.currentUser;
        if (!user) return null;
        return await user.getIdToken();
    }

    // ユーザー設定を取得
    async getUserSetting(): Promise<UserSetting> {
        // キャッシュがあれば返す
        if (this.userSetting) {
            return this.userSetting;
        }

        // ログインしていない場合はデフォルト設定を返す
        if (!this.userState.isLoggedIn) {
            return {
                timeLimitPresentation: true,
                BGM: true,
                typingSound: true,
                otherSoundEffect: true
            };
        }

        // ログインしている場合はサーバに問い合わせて返す
        try {
            const {userSetting} = await this.fetchDataFromServer();
            return userSetting;
        } catch (error) {
            console.error('設定取得エラー:', error);
            // エラーの場合はデフォルト設定を返す
            return {
                timeLimitPresentation: true,
                BGM: true,
                typingSound: true,
                otherSoundEffect: true
            };
        }
    }

    // ユーザー設定を保存
    async setUserSetting(setting: UserSetting): Promise<void> {
        // ログイン状態にかかわらず，ローカルにはキャッシュする
        this.userSetting = setting;

        // ログインしていない場合はサーバにアクセスしない
        if (!this.userState.isLoggedIn) return;

        try {
            const token = await this.getAuthToken();
            if (!token) throw new Error('認証トークンの取得に失敗しました');

            const response = await fetch(
                `${Host.functions.href}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ setting: setting })
            });

            if (!response.ok) {
                throw new Error('ユーザー設定の保存に失敗しました');
            }
        } catch (error) {
            console.error('設定保存エラー:', error);
        }
    }

    // 記録サマリーを取得
    async getRecordSummary(): Promise<RecordSummary> {
        // キャッシュがあれば返す
        if (this.recordSummary) {
            return this.recordSummary;
        }

        // ログインしていない場合は空のサマリーを返す
        if (!this.userState.isLoggedIn) {
            return {
                totalTypeByte: 0,
                bestWPM: 0
            };
        }

        // ログインしていればサーバに問い合わせて返す
        try {
            const { recordSummary } = await this.fetchDataFromServer();
            return recordSummary;
        } catch (error) {
            console.error('サマリー取得エラー:', error);
            // エラーの場合は空のサマリーを返す
            return {
                totalTypeByte: 0,
                bestWPM: 0
            };
        }
    }

    // ゲーム記録を保存
    async putRecord(record: GameStats): Promise<void> {
        // キャッシュを更新
        this.lastRecord = record;

        // ローカルサマリーを更新
        if (this.recordSummary) {
            this.recordSummary.totalTypeByte += record.correctTypes;
            this.recordSummary.bestWPM = Math.max(
                this.recordSummary.bestWPM,
                record.wpm
            );
        }

        // ログインしていなければサーバーには保存しない
        if (!this.userState.isLoggedIn) return;

        try {
            const token = await this.getAuthToken();
            if (!token) throw new Error('認証トークンの取得に失敗しました');

            const recordData = {
                correctTypes: record.correctTypes,
                mistypes: record.mistypes,
                correctRate: record.correctRate,
                timeRemaining: record.timeRemaining,
                wpm: record.wpm,
                totalTime: record.totalTime,
                recordedAt: new Date().toISOString()
            };

            const response = await fetch(
                `${Host.functions.href}/api/records`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(recordData)
            });

            if (!response.ok) {
                throw new Error('ゲーム記録の保存に失敗しました');
            }
        } catch (error) {
            console.error('記録保存エラー:', error);
        }
    }

    // 最新のゲーム記録を取得
    getLastRecord(): GameStats {
        if (this.lastRecord === null) {
            throw new Error("putRecordを呼び出す前にgetLastRecordが呼ばれました。");
        }
        return this.lastRecord;
    }

    // 最新のゲーム記録をサーバーから取得
    async fetchLastRecord(): Promise<GameStats | null> {
        // ログインしていなければnullを返す
        if (!this.userState.isLoggedIn) return null;

        try {
            const token = await this.getAuthToken();
            if (!token) throw new Error('認証トークンの取得に失敗しました');

            const response = await fetch(
                `${Host.functions.href}/api/records/latest`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 404) {
                return null; // 記録が見つからない
            }

            if (!response.ok) {
                throw new Error('ゲーム記録の取得に失敗しました');
            }

            const data = await response.json();
            const record: GameStats = {
                correctTypes: data.correctTypes,
                mistypes: data.mistypes,
                correctRate: data.correctRate,
                timeRemaining: data.timeRemaining,
                wpm: data.wpm,
                totalTime: data.totalTime
            };

            this.lastRecord = record;
            return record;
        } catch (error) {
            console.error('記録取得エラー:', error);
            return null;
        }
    }
    
}


// namespace Endpoints {
//     const login = new URL('/api/login', Host.functions);
//     const signup = new URL('/api/signup', Host.functions);
//     const getData = new URL('/api/user', Host.functions);
//     const setData = new URL('/api/user', Host.functions);
// }

// class Intaractor {

// }

// class AuthModule {

// }

// class Parser {

// }

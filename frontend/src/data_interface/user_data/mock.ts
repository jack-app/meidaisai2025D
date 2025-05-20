import { createStore } from "solid-js/store";
import { GameRecord, UserId, UserName, type RecordSummary, type UserSetting, type UserState } from "./types";
import type IUserDataManager from "./interface";

export default class UserDataManagerMock implements IUserDataManager{
    private userState: UserState = {
                isLoggedIn: false,
            }
    private listeners: ((state: UserState) => void)[] = [];
    private addUserStateListener(callback: (state: UserState) => void): void {
        this.listeners.push(callback);
        callback(this.userState);
    }
    private updateUserState(state: UserState) {
        this.userState = state;
        this.listeners.forEach((listener) => listener(state));
    }

    private userSetting: UserSetting = {
        timeLimitPresentation: true,
        BGM: true,
        typingSound: true,
        otherSoundEffect: true,
    }

    constructor() {
        setTimeout(() => {
            console.log("UserDataManagerMock: ログイン状態に切り替えました");
            this.updateUserState(
                {
                    id: UserId.generate(),
                    name: new UserName("John Doe"),
                    isLoggedIn: true,
                }
            )
        }, 2000)
    }

    useUserState() {
        const [state, setState] = createStore<UserState>(this.userState);
        this.addUserStateListener(setState);
        return state;
    }

    async getUserSetting(): Promise<UserSetting> {
        return this.userSetting;
    }
    setUserSetting(setting: UserSetting): void {
        this.userSetting = setting;
    }

    private summray: RecordSummary = {
        totalTypeCount: 1000,
        bestScore: 100,
    }
    async getRecordSummary(): Promise<RecordSummary> {
        return this.summray;
    }

    private lastRecord: GameRecord | null = null;
    putRecord(record: GameRecord): void {
        this.lastRecord = record;
        this.summray.totalTypeCount += record.correctTypeCount;
        this.summray.bestScore = Math.max(this.summray.bestScore, record.score);
    }

    getLastRecord(): GameRecord {
        if (this.lastRecord === null) {
            throw new Error("putRecordを呼び出す前にgetLastRecordが呼ばれました．");
        }
        return this.lastRecord;
    }
}

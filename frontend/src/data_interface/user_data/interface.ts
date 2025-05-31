import type { GameStats, RecordSummary, UserSetting, UserState } from "./types";

export default interface IUserDataManager {
    useUserState(): UserState;

    getUserSetting(): Promise<UserSetting>;
    setUserSetting(setting: UserSetting): void;

    getRecordSummary(): Promise<RecordSummary>;

    putRecord(record: GameStats): void;
    getLastRecord(): GameStats;
}
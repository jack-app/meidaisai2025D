import type { GameRecord, RecordSummary, UserSetting, UserState } from "./types";

export default interface IUserDataManager {
    useUserState(): UserState;

    getUserSetting(): Promise<UserSetting>;
    setUserSetting(setting: UserSetting): void;

    getRecordSummary(): Promise<RecordSummary>;

    putRecord(record: GameRecord): void;
    getLastRecord(): GameRecord;
}
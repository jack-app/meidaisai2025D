import type { UserState } from "../../types";

export default interface IUserDataManager {
    useUserState(): UserState;
}
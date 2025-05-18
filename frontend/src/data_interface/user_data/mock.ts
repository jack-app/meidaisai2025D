import { createStore } from "solid-js/store";
import { UserId, UserName, type UserState } from "../../types";
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
    private update(state: UserState) {
        this.userState = state;
        this.listeners.forEach((listener) => listener(state));
    }

    constructor() {
        setTimeout(() => {
            console.log("UserDataManagerMock: ログイン状態に切り替えました");
            this.update(
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
}

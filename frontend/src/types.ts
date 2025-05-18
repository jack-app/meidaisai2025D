
// GameData
export type ProblemData = {

}


// UserData
export type RecordData = {

}

export class UserId {
    constructor(public id: string) {}

    static generate(): UserId {
        return new UserId(crypto.randomUUID());
    }
}

export class UserName {
    constructor(public name: string) {}
}

export type UserState = {
    id?: UserId;
    name?: UserName;
    isLoggedIn: boolean;
}

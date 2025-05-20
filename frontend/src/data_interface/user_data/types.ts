export class GameRecord {
    public readonly recordedAt: Date = new Date();
    constructor(
        public readonly correctTypeCount: number,
        public readonly mistypeCount: number,
        public readonly bonus: number = 0,
    ) {}
    
    get score(): number {
        return this.correctTypeCount - this.mistypeCount + this.bonus;
    }
}

export type RecordSummary = {
    totalTypeCount: number;
    bestScore: number;
}

export type UserSetting = {
    timeLimitPresentation: boolean;
    BGM: boolean;
    typingSound: boolean;
    otherSoundEffect: boolean;
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

export type GameStats = {
  correctTypes: number,
  mistypes: number,
  correctRate: number,
  timeRemaining: number,
  wpm: number,
  totalTime: number,
}

export type RecordSummary = {
    totalTypeByte: number;
    bestWPM: number;
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

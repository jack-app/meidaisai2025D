import { Host } from '../../const';
import type IUserDataManager from './interface';
import type { UserState } from './types';

export default class UserDataManager implements IUserDataManager {
    useUserState(): UserState {
        throw new Error('"useUserState"は開発段階でExampleSceneが動作するために用いるのみで，本番では使わない．');
    }
    
}

namespace Endpoints {
    const login = new URL('/api/login', Host.functions);
    const signup = new URL('/api/signup', Host.functions);
    const getData = new URL('/api/user', Host.functions);
    const setData = new URL('/api/user', Host.functions);
}

class Intaractor {

}

class AuthModule {

}

class Parser {

}

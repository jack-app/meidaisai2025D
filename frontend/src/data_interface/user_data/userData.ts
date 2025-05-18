import { Host } from '../../const';
import type IUserDataManager from './interface';

export default class UserDataManager implements IUserDataManager {
    
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

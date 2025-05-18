import { Host } from '../../const'
import type IGameDataProvider from './interface'

export default class GameDataProvider implements IGameDataProvider{
    
}

namespace Endpoints {
    const assets = new URL('/game_assets', Host.hosting)
    const metadata = new URL('/game_metadata.json', Host.hosting)
}

class Fetcher {

}

class Parser {

}

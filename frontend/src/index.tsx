/* @refresh reload */
import { render } from 'solid-js/web'
import './index.css'

const root = document.getElementById('root')

import Phaser from 'phaser'
import Example from './scenes/example.tsx'
import { createSignal, Match, onMount, Switch } from 'solid-js'
import { physics, fps, dom, scale } from './gameConfig.ts'

function GameContainer() {
    const scene = [Example]
 
    const canvasContainer = <div id='phaser-game-container'/> as HTMLDivElement
    const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO, parent: canvasContainer.id, scene, 
        physics, fps, dom, scale,
    }
    onMount(() => {
        new Phaser.Game(gameConfig);
    })

    return canvasContainer
}

function App() {
    const [scene, setScene] = createSignal('example')

    return (
        <Switch>
            <Match when={scene() == 'example'}> 
                <>
                    <p>example scene</p>
                    <button onClick={() => setScene('game')}>go to game</button>
                </>
            </Match>
            <Match when={scene() == 'game'}> <p>game scene</p> </Match>
        </Switch>
    )
}

render(() => <GameContainer />, root!)
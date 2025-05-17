import Phaser from "phaser"
import { scale } from "../gameConfig"


export default class Example extends Phaser.Scene {
    private currentDomObject: Phaser.GameObjects.DOMElement | null = null
    constructor() {
        super('Example')
    }
    /// 画面を表示するための準備をする
    preload() {
        this.load.setBaseURL('https://labs.phaser.io')

        this.load.image('sky', 'assets/skies/space3.png')
        this.load.image('logo', 'assets/sprites/phaser3-logo.png')
        this.load.image('red', 'assets/particles/red.png')
    }
    /// 画面を作る
    create() {
        this.add
        .image(scale.width / 2, scale.height / 2, 'sky')
        .setOrigin(0.5, 0.5)

        // this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
        //     // this.currentDomObject?.destroy()
        //     this.currentDomObject = this.add.dom(
        //         scale.width / 2, scale.height / 2,
        //         <div>
        //             <h1>Pointer is moving</h1>
        //             <p>Pointer X: {pointer.x}</p>
        //             <p>Pointer Y: {pointer.y}</p>
        //         </div> as HTMLElement
        //     )
        // })
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            // this.currentDomObject?.destroy()
            this.currentDomObject?.destroy()
            this.currentDomObject = this.add.dom(
                0, 0,
                <div>
                    <h1>Pointer is down</h1>
                    <p>Pointer X: {pointer.x}</p>
                    <p>Pointer Y: {pointer.y}</p>
                </div> as HTMLElement
            )
        })
        this.input.keyboard?.on('keydown',(event: KeyboardEvent) => {
            // event.preventDefault()
            this.currentDomObject?.destroy()
            this.currentDomObject = this.add.dom(
                0, 0,
                <div>
                    <h1>Key down</h1>
                    <p>key: {event.key}</p>
                </div> as HTMLElement
            )
        });

        const particles = this.add.particles(0, 0, 'red', {
            speed: 100,
            scale: { start: 1, end: 0 },
            blendMode: 'ADD'
        })

        const logo = this.physics.add.image(400, 100, 'logo')

        logo.setVelocity(100, 200)
        logo.setBounce(1, 1)
        logo.setCollideWorldBounds(true)

        particles.startFollow(logo)
    }
    /// 画面を更新する
    /// time: ゲーム内経過時間
    /// delta: 前回のフレームからの経過時間
    /// updateは毎フレーム呼ばれる
    update(time: number, delta: number) {
        
    }    
}
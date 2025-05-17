import { createSignal, onCleanup, onMount, Show, type JSXElement } from "solid-js";
import SceneBase from "./sceneBase";
import type SceneManager from "./sceneManager";
import { Container, Assets, Sprite, Application as PixiApp, type Texture } from 'pixi.js'
import Stack from "../components/stack";
import scenes from "./sceneNames";

export default class ExampleScene extends SceneBase {
    
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(manager, scenes.example);
    }

    private textureAsset!: Texture;
    private pixiApp!: PixiApp;
    async preload(): Promise<void> {
        console.log(`Preloading ${this.name}...`);
        
        const pixiApp = new PixiApp();

        // 各種初期化を並行して行う．
        [this.textureAsset, ] = await Promise.all([
            // アセットを用意する
            Assets.load('https://pixijs.com/assets/bunny.png'),
            // 1秒待つ
            new Promise((resolve)=>{setTimeout(resolve, 1000)}),
            // PixiAppの初期化. 
            // pixiAppにはthis.pixiAppは初期化後に代入しないとバグるので注意
            pixiApp.init({
                backgroundAlpha: 0 // キャンバスを透明にする
            }),
        ]);

        this.pixiApp = pixiApp;
        
        // 初期化が終わったら、exampleシーン（このシーン）を表示する
        this.manager.changeSceneTo(scenes.example);
    }

    //
    // PIXI JSによるキャンバスの描画
    //

    MiddleCanvas(): JSXElement {
        const pixiContainer = this.makePixiAppContent();

        const canvasHolder = <div style={{height: '100%', width: '100%'}}>
            {this.pixiApp.canvas}
        </div> as HTMLElement;

        // キャンバスが表示されたら，その大きさに合わせてキャンバス内のコンテンツを配置する．
        onMount(() => {
            console.log("MiddleCanvas onMount");
            this.arrangeContent(pixiContainer, canvasHolder);
            // ウィンドウがリサイズされたときは再配置する
            window.addEventListener('resize', () => {
                this.arrangeContent(pixiContainer, canvasHolder);
            });
        })

        return canvasHolder;
    }

    // PixiAppのコンテンツを作成する
    makePixiAppContent() {
        const container = new Container();    
        this.pixiApp.stage.addChild(container);

        // Create a 5x5 grid of bunnies in the container
        for (let i = 0; i < 25; i++)
        {
            const bunny = new Sprite(this.textureAsset!);
    
            bunny.x = (i % 5) * 40;
            bunny.y = Math.floor(i / 5) * 40;
            container.addChild(bunny);
        }

        // Center the bunny sprites in local container coordinates
        container.pivot.x = container.width/2;
        container.pivot.y = container.height/2;
    
        // Listen for animate update
        this.pixiApp.ticker.add((time) =>
        {
            // Continuously rotate the container!
            // * use delta to create frame-independent transform *
            container.rotation -= 0.01 * time.deltaTime;
        });

        return container;
    }

    // PixiAppのコンテンツを配置する
    arrangeContent(contentContainer: Container, canvasHolder: HTMLElement) {

        if (!this.pixiApp) {
            throw new Error("PixiApp is not initialized");
        }

        this.pixiApp.renderer.resize(
            canvasHolder.clientWidth, 
            canvasHolder.clientHeight
        );


        const desiredContainerSize = Math.min(
            this.pixiApp.screen.width,
            this.pixiApp.screen.height
        )/2;

        // Move the container to the center
        contentContainer.x = this.pixiApp.screen.width / 2;
        contentContainer.y = this.pixiApp.screen.height / 2;

        contentContainer.scale = desiredContainerSize / 200; // 40 * 5
    }

    //
    // コンポーネントを作成する
    //

    makeComponent(): JSXElement {
        const [getAction, setAction] = createSignal<null|string>();
        const keyListener = (e: KeyboardEvent) => {
            setAction(`pressed: ${e.key}`);
        }
        
        onMount(() => {
            if (this.pixiApp) {
                this.pixiApp.start();
            }
            window.addEventListener('keydown', keyListener);

        })
        onCleanup(() => {
            if (this.pixiApp) {
                this.pixiApp.stop();
            }
            window.removeEventListener('keydown', keyListener);
        })

        return <Stack>
            {/*上の方に書いてある要素から先に描画されるから，一番上の要素が最背面になる．*/}
            <Stack.Item>
                <Background/>
            </Stack.Item>
            <Stack.Item>
                {this.MiddleCanvas()}
            </Stack.Item>
            {/*Stack.Itemは何も指定しなければデフォルトのスタイルが当たるが，指定することも可能*/}
            <Stack.Item style={{left: '10%', top: '10%', width: 'fit-content', height: 'fit-content'}}>
                <h1>Example Scene</h1>
                <p>Example scene with Pixi.js</p>
                <Show when={getAction()}>
                    <p>{getAction()}</p>
                </Show>
            </Stack.Item>
            <Stack.Item style={{right: '10%', bottom: '10%', width: 'fit-content', height: 'fit-content'}}>
                <button onclick={() => {
                    setAction("button was clicked");
                }}>
                    <h1>Click me!</h1>
                </button>
            </Stack.Item>
        </Stack> as HTMLElement;
    }
}

function Background() {
    return <div style={{
        width: '100%',
        height: '100%',
        "background-color": 'blue',
    }}/>
}
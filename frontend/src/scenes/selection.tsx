import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";

export default class SelectionScene extends SceneBase {
    
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.selection
        );
    }

    private pixiApp!: PixiApp;
    async preload(): Promise<void> {
        console.log(`Preloading ${this.sceneSignature}...`);
        
        const pixiApp = new PixiApp();

        // 各種初期化を並行して行う．
        await Promise.all([
            
            (async () => {
                // ここで初期化処理
                // ...
            })(),

            (async () => {
                // ここで初期化処理
                // ...
            })(),

            // PixiAppの初期化. 
            // pixiAppにはthis.pixiAppは初期化後に代入しないとバグるので注意
            pixiApp.init({
                backgroundAlpha: 0 // キャンバスを透明にする
            }),
        ]);

        this.pixiApp = pixiApp;
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

        // ここでコンテンツを作成する
        // ...

        return container;
    }

    // PixiAppのコンテンツを配置する
    arrangeContent(contentContainer: Container, canvasHolder: HTMLElement) {
        this.pixiApp.renderer.resize(
            canvasHolder.clientWidth, 
            canvasHolder.clientHeight
        );

        // ここでキャンバス（canvasHolder）の大きさに合わせてコンテンツを配置する
        // ...

    contentContainer.position.set(
    canvasHolder.clientWidth / 2,
    canvasHolder.clientHeight / 2
  );

    }

    //
    // コンポーネントを作成する
    //

    makeComponent(): JSXElement {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            "background-image": 'url(/images/background.png)',
            "background-size": 'cover',
            display: 'flex',
            "flex-direction": 'column',
            "justify-content": 'center',
            "align-items": 'center',
            gap: '20px'
        }}>
            {[
                {label: "設定", sig: SceneSig.setting}, 
                {label:"遊び方", sig:SceneSig.explanation}, 
                {label: "スタート", sig: SceneSig.game}, 
                {label: "成績", sig: SceneSig.record}
            ].map(({label, sig}) => (
                <button style={{
                    width: '400px',
                    padding: '20px',
                    "font-size": '20px',
                    "background-color": '#E3DEF1',
                    color: 'black',
                    border: 'none',
                    "border-radius": '8px'
                }}
                onClick={() => {
                    this.manager.changeSceneTo(sig);
                }}
                >
                    {label}
                </button>
            ))}
        </div>
    );
}

}
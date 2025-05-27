import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";

export default class TitleScene extends SceneBase {
    
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.title
        );
    }

   private pixiApp!: PixiApp;
async preload(): Promise<void> {
    console.log(`Preloading ${this.sceneSignature}...`);

    const pixiApp = new PixiApp();

    // PixiAppの初期化
    await pixiApp.init({
        backgroundAlpha: 0 // キャンバスを透明にする
    });

    this.pixiApp = pixiApp;

    this.manager.changeSceneTo(SceneSig.title);
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

    }

    //
    // コンポーネントを作成する
    //

    makeComponent(): JSXElement {
        console.log("makeComponent called");
  return (
        <div style={{
            width: '100%',
            height: '100%',
            "background-image": 'url(/images/bg.png)',
            "background-size": 'cover',
            display: 'flex',
            "flex-direction": 'column',
            "justify-content": 'center',
            "align-items": 'center',
            gap: '20px',
        }}>
            <h1 style={{
                color: 'white',
                "font-size": '48px',
                "font-weight": 'bold'
            }}>
                METYPE
            </h1>
            <button style={{
                padding: '10px 20px',
                "font-size": '18px',
                "background-color": 'lightblue',
                border: 'none',
                "border-radius": '5px'
            }}>
                ログイン
            </button>
        
        </div>
    );
}
}
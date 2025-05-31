import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";

// ログイン処理はfirebase authを使う形に変更
import type { CredentialResponse } from "google-one-tap";

// タイトルシーンとログインシーンは統合

declare global {
  interface Window {
    google: any;
  }
}

export default class TitleScene extends SceneBase {
    
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.title,
             { initialScene: true } 
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
     this.makePixiAppContent();

        const canvasHolder = <div style={{height: '100%', width: '100%'}}>
            {this.pixiApp.canvas}
        </div> as HTMLElement;

        // キャンバスが表示されたら，その大きさに合わせてキャンバス内のコンテンツを配置する．
        onMount(() => {
            console.log("MiddleCanvas onMount");
            this.arrangeContent(canvasHolder);
            // ウィンドウがリサイズされたときは再配置する
            window.addEventListener('resize', () => {
                this.arrangeContent(canvasHolder);
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
    arrangeContent(canvasHolder: HTMLElement) {
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
 onMount(() => {
        if (window.google && window.google.accounts && window.google.accounts.id) {
            window.google.accounts.id.initialize({
                client_id: "996291379966-oikrm16dmud9n0d8fhardra64mobfudm.apps.googleusercontent.com",
                callback: (response: CredentialResponse) => {
                    console.log("Googleログイン成功", response);
                    // ここでバックエンドと通信するなどの処理を書く
                    //そのあとにセレクト画面へ遷移
    this.manager.changeSceneTo(SceneSig.selection);
                },
            });

            window.google.accounts.id.renderButton(
                document.getElementById("g_id_signin"),
                { theme: "outline", size: "large" }
            );
        } else {
            console.error("GoogleログインAPIが読み込まれていません");
        }
    });

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
                "font-size": '150px',
                "font-weight": 'bold'
               
            }}>
                METYPE
            </h1>
            <div style={{ display: "flex", "flex-direction": "column", "align-items": "center", gap: "1rem" }}>


  {/* Googleログインボタンの表示位置 */}
  <div id="g_id_signin"></div>
</div>

    <button
  style={{
    color: 'white',
    "font-size": '16px',
    "background-color": '#007bff',
    padding: '8px 16px',
    border: 'none',
    "border-radius": '4px',
    cursor: 'pointer'
  }}
  onClick={() => {
    console.log("ゲストモードでログインしました");
    this.manager.changeSceneTo(SceneSig.selection);  // ← セレクト画面へ
  }}
>
  ゲスト
</button>

        </div>
    );
}
}


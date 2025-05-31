import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";

export default class ExplanationScene extends SceneBase {
   
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.explanation
        );
    }

    private pixiApp!: PixiApp;
    async preload(): Promise<void> {
        console.log('Preloading ${this.sceneSignature}...');
       
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
                backgroundAlpha: 0, // キャンバスを透明にする
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

    }

    //
    // コンポーネントを作成する
    //

    makeComponent(): JSXElement {
        return <>
        <div style={{
            "width": '100%',
            "height": '100%',
            "background-image": 'url("/background.png")',  // ← このように書く
            "background-size": 'cover',
            "background-position": 'center',
            "background-repeat": 'no-repeat',
            "position": 'absolute',
            "top": '0px',
            "left": '0px',
            "z-index": '-1',
        }}>
        </div>
        <div style={{
            "width": '70vw',
            "height":'18vh',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'19vh',
            "left":'20vw',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3vw',
            "color":'black' //上の四角
            }}>
          表示されるコードをタイピングしましょう。  
        </div>
        <div style={{
            "width":'70vw',
            "height":'18vh',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'46vh',
            "left":'20vw',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3vw',
            "color":'black'  //真ん中の四角
        }}>
            1つのコード当たりの制限時間は秒です。
        </div>
        <div style={{
            "width": '70vw',
            "height":'18vh',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'73vh',
            "left":'20vw',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3vw',
            "color":'black'  //下の四角
        }}>
             コードをタイピングできた数に応じてメーターが上がります。
        </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'17vh',
            "left":'5vw',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white' //上の丸
        }}>
            ルール
            </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'44vh',
            "left":'5vw',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white'  //真ん中の丸
        }}>
            時間制限
            </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'71vh',
            "left":'5vw',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white',  //下の丸
        }}>
            メーター
            </div>
         <div style={{
            "width": '100%',
            "height":'12vh',
            "background-color":'#7C11EA',
            "position":'absolute',
            "top":'0px',
            "left":'0px',
            "font-size": '6vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center',
            "padding-left": '5vw',
            "color":'white',
        }}>
            遊び方
        </div>
       
        <button style={{
            "position":'absolute',
            "top":'1vh',
            "left":'85vw',
            "width":'13vw',
            "height":'9vh',
            "font-size":'4vh',
            "font-weight":'bold',
            "background-color":'f8f8ff',
            "color":'black',
            "border":'none',
            "border-radius":'1vh',
            "cursor":'pointer',
            "letter-spacing":'1vh',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
        }}
        onClick={() => {
            this.manager.changeSceneTo(SceneSig.selection);
        }}
    >
        閉じる
    </button>
        </>
    }
}
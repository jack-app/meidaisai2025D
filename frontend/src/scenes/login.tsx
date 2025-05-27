import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";

// クラスは名前付きエクスポートに変更
export class LoginScene extends SceneBase {
    private pixiApp!: PixiApp;

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.login
        );
    }

    async preload(): Promise<void> {
        console.log(`Preloading ${this.sceneSignature}...`);
        const pixiApp = new PixiApp();

        await Promise.all([
            (async () => { /* 初期化処理 */ })(),
            (async () => { /* 初期化処理 */ })(),
            pixiApp.init({ backgroundAlpha: 0 }),
        ]);

        this.pixiApp = pixiApp;
    }

    MiddleCanvas(): JSXElement {
        const pixiContainer = this.makePixiAppContent();

        const canvasHolder = <div style={{ height: '100%', width: '100%' }}>
            {this.pixiApp.canvas}
        </div> as HTMLElement;

        onMount(() => {
            this.arrangeContent(pixiContainer, canvasHolder);
            window.addEventListener('resize', () => {
                this.arrangeContent(pixiContainer, canvasHolder);
            });
        });

        return canvasHolder;
    }

    makePixiAppContent() {
        const container = new Container();
        this.pixiApp.stage.addChild(container);
        // コンテンツ作成
        return container;
    }

    arrangeContent(contentContainer: Container, canvasHolder: HTMLElement) {
        this.pixiApp.renderer.resize(canvasHolder.clientWidth, canvasHolder.clientHeight);
        // 配置処理
    }

    makeComponent(): JSXElement {
        return <>
            ここでコンポーネントを作成する...
        </>;
    }
}

// 関数コンポーネントはデフォルトエクスポートに
export default function Login() {
    onMount(() => {
        if (!window.google || !window.google.accounts) {
            console.error("Google Identity Servicesが読み込まれていません");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: "996291379966-oikrm16dmud9n0d8fhardra64mobfudm.apps.googleusercontent.com",
            callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-login-button")!,
            {
                theme: "outline",
                size: "large",
                width: "300",
            }
        );
    });

    function handleCredentialResponse(response: any) {
        console.log("IDトークン:", response.credential);
        // ログイン後処理
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                flexDirection: "column",
            }}
        >
            <h2>Googleでログイン</h2>
            <div id="google-login-button"></div>
        </div>
    );
}

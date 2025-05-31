import { onMount, type JSXElement, createEffect } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from "pixi.js";
import SceneSig from "./fundation/signatures";
import { userDataManager } from "../const"; // const.tsからインポートに変更
import type { CredentialResponse } from "google-one-tap";

declare global {
  interface Window {
    google: any;
  }
}

export default class TitleScene extends SceneBase {
  constructor(manager: SceneManager) {
    super(manager, SceneSig.title, { initialScene: true });
  }

  private pixiApp!: PixiApp;

  async preload(): Promise<void> {
    console.log(`Preloading ${this.sceneSignature}...`);

    const pixiApp = new PixiApp();
    await pixiApp.init({
      backgroundAlpha: 0,
    });

    this.pixiApp = pixiApp;
    this.manager.changeSceneTo(SceneSig.title);
  }

  MiddleCanvas(): JSXElement {
    this.makePixiAppContent();

    const canvasHolder = (
      <div style={{ height: "100%", width: "100%" }}>{this.pixiApp.canvas}</div>
    ) as HTMLElement;

    onMount(() => {
      console.log("MiddleCanvas onMount");
      this.arrangeContent(canvasHolder);
      window.addEventListener("resize", () => {
        this.arrangeContent(canvasHolder);
      });
    });

    return canvasHolder;
  }

  makePixiAppContent() {
    const container = new Container();
    this.pixiApp.stage.addChild(container);
    return container;
  }

  arrangeContent(canvasHolder: HTMLElement) {
    this.pixiApp.renderer.resize(
      canvasHolder.clientWidth,
      canvasHolder.clientHeight
    );
  }

  // Googleログインボタンのクリックハンドラー
  private async handleGoogleLogin() {
    try {
      const success = await userDataManager.signInWithGoogle();
      if (success) {
        console.log("Googleログイン成功");
        // ログイン成功は createEffect で自動的に処理される
      } else {
        console.error("Googleログインに失敗しました");
      }
    } catch (error) {
      console.error("ログインエラー:", error);
    }
  }

  makeComponent(): JSXElement {
    console.log("makeComponent called");

    const userState = userDataManager.useUserState();

    // ログイン状態が変わったら自動的に遷移
    createEffect(() => {
      if (userState.isLoggedIn) {
        console.log("ログイン状態を検知、セレクト画面へ遷移");
        this.manager.changeSceneTo(SceneSig.selection);
      }
    });

    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          "background-image": "url(/images/bg.png)",
          "background-size": "cover",
          display: "flex",
          "flex-direction": "column",
          "justify-content": "center",
          "align-items": "center",
          gap: "20px",
        }}
      >
        <h1
          style={{
            color: "white",
            "font-size": "150px",
            "font-weight": "bold",
          }}
        >
          METYPE
        </h1>

        <div
          style={{
            display: "flex",
            "flex-direction": "column",
            "align-items": "center",
            gap: "1rem",
          }}
        >
          {/* Firebaseログインボタン */}
          <button
            style={{
              color: "white",
              "font-size": "16px",
              "background-color": "#4285f4",
              padding: "12px 24px",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer",
              "min-width": "200px",
            }}
            onClick={() => this.handleGoogleLogin()}
          >
            Googleでログイン
          </button>

          {/* ゲストログインボタン */}
          <button
            style={{
              color: "white",
              "font-size": "16px",
              "background-color": "#007bff",
              padding: "8px 16px",
              border: "none",
              "border-radius": "4px",
              cursor: "pointer",
              "min-width": "200px",
            }}
            onClick={() => {
              console.log("ゲストモードでログインしました");
              this.manager.changeSceneTo(SceneSig.selection);
            }}
          >
            ゲストで続行
          </button>
        </div>
      </div>
    );
  }
}

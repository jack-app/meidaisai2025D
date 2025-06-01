import { SourceCode } from "./problems";

const SourceCodeInstances: SourceCode[] = [
new SourceCode(
"view_function",
`
// 見た目を持つコンポーネントのルート
function ViewRoot() {

  // 共通のシーンマネージャでシーンを実体化する．
  // ローディングシーンだけ特殊なので別枠でインスタンス化しておく．
  const loadingScene = new LoadingScene(sceneManager)
  instanciateAllScenes(sceneManager)

  // シーンマネージャーがシーンを切り替えれるように設定する．
  const [getScene, setScene] = createSignal<SceneBase>();
  sceneManager.bindSceneChangeCallback(setScene);
  
  // 以下表示する内容
  return (
    <FixedAspectRatio width={1600} height={900}>
      <Show 
        when={getScene()} 
        fallback={loadingScene.makeComponent()}
      >
          {getScene()!.makeComponent()}
      </Show>
    </FixedAspectRatio>
  )
}

export default ViewRoot`,
"typescript",
),
new SourceCode(
"frontend_index",
`/* @refresh reload */
import './index.css'

// solid bootstrap
import { render } from 'solid-js/web'
import ViewRoot from './view.tsx'
const root = document.getElementById('root')
render(
    () => <>
        <ViewRoot />
    </>, 
    root!
)`,
"typescript",
),
new SourceCode(
"const_ts",
`import SceneManager from './scenes/fundation/sceneManager';
import type IUserDataManager from './data_interface/user_data/interface';
import UserDataManager from './data_interface/user_data/userData'; // 実装版を使用

const host = new URL(location.href).host

const isDev = 
    host.startsWith('localhost') 
    || host.startsWith('127.0.0.1') 
    || host.startsWith('::1')

if (isDev) {
    console.log('開発環境で実行しています．');
}

// Singleton - 実装版のUserDataManagerを使用
export const userDataManager: IUserDataManager = new UserDataManager()
export const sceneManager = new SceneManager()`,
"typescript"
),
new SourceCode(
"title_scene",
`import { onMount, type JSXElement, createEffect } from "solid-js";
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
    console.log(\`Preloading \${this.sceneSignature}...\`);

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
}`,
"typescript",
),
new SourceCode(
"game_scene",
`import { onMount, createSignal, type JSXElement, type Accessor, type Signal } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp, Text, TextStyle, Graphics } from 'pixi.js'
import SceneSig from "./fundation/signatures";
import styles from "./game.module.css";
import { type GameStats, type UserSetting } from "../data_interface/user_data/types";
import { userDataManager, Host } from "../const.ts";
import metype from "/images/METYPE.png";
import { render } from "solid-js/web";

import { Problem } from "../game_data/problems.ts";
import SourceCodeInstances from "../game_data/instances.ts";

class GameDataProvider {
  static getProblem(): Problem {
    // ProblemInstancesからランダムに問題を取得して返す．
    return SourceCodeInstances[
      Math.floor(Math.random() * SourceCodeInstances.length)
      % SourceCodeInstances.length
    ].generateProblem();
  }
}

// ゲーム統計の型


export default class GameScene extends SceneBase {
    
  constructor(manager: SceneManager) {
    super(manager, SceneSig.game);
  }
  private pixiApp!: PixiApp;
  private problemData!: Problem;
  private gameSetting?: UserSetting;
  /** @deprecated problemDataが現在位置の情報を持つようになったためdeprecated */
  private currentPosition = 0;
  private textContainer!: Container;
  private backgroundContainer!: Container;
  
  // Solid.jsシグナルでリアクティブな状態管理
  public statsSignal!: Signal<GameStats>;
  public get stats() { return this.statsSignal[0]; }
  public get setStats() { return this.statsSignal[1]; }
  
  private gameStartedSignal = createSignal(false);
  private get gameStarted() { return this.gameStartedSignal[0]; }
  private get setGameStarted() { return this.gameStartedSignal[1]; }
  
  private gameEndedSignal = createSignal(false);
  private get gameEnded() { return this.gameEndedSignal[0]; }
  private get setGameEnded() { return this.gameEndedSignal[1]; }
  private gameTimer?: number;

  async preload(): Promise<void> {
    console.log(\`Preloading \${this.sceneSignature}...\`);

    const pixiApp = new PixiApp();
    await pixiApp.init({ 
      backgroundAlpha: 0 
    })
    this.pixiApp = pixiApp;
  }

  async load(): Promise<void> {
    this.problemData = GameDataProvider.getProblem();
    this.gameSetting = await userDataManager.getUserSetting();
    this.statsSignal = createSignal<GameStats>({
      correctTypes: 0,
      mistypes: 0,
      timeRemaining: 60,
      correctRate: 0,
      wpm: 0,
      totalTime: 60
    });
    this.setGameEnded(false);
    this.setGameStarted(false);
    this.pixiApp.stage.removeChildren().forEach(child => {
      child.destroy();
    });;
  }


  // ゲーム開始
  private startGame(): void {
    if (this.gameStarted()) return;
    
    this.setGameStarted(true);
    this.setGameEnded(false);
    
    // タイマー開始
    this.gameTimer = window.setInterval(() => {
      const currentStats = this.stats();
      if (
        // timelimitが有効な場合のみタイマーが0以下になったら終了
        this.gameSetting?.timeLimitPresentation
        && currentStats.timeRemaining <= 0
      ) {
        this.endGame(this.stats());
        return;
      }
      
      this.setStats(prev => ({
        ...prev,
        timeRemaining: prev.timeRemaining - 1
      }));
      this.setStats(prev => ({
        ...prev,
        wpm: Math.round(60 * prev.correctTypes / (prev.totalTime - prev.timeRemaining))
      }));
    }, 1000);
  }

  // ゲーム終了
  private endGame(Stats: GameStats): void {
    this.setGameEnded(true);
    if (this.gameTimer) {
      clearInterval(this.gameTimer);
    }
    userDataManager.putRecord(Stats)
  }

  // キー入力処理
  private handleKeyInput(event: KeyboardEvent): void {
    if (!this.gameStarted() || this.gameEnded()) {
      if (event.key === 'Enter' && !this.gameStarted()) {
        this.startGame();
      }
      if (event.key === 'Enter' && this.gameEnded()) {
        this.manager.changeSceneTo(SceneSig.selection);
      }
      return;
    }

    // 特殊キーは無視
    if (event.key.length > 1 && event.key !== 'Tab' || event.key ===' ') return;
    
    event.preventDefault();
    
    const targetChar = this.problemData.charAtCursor();
    
    if (event.key === targetChar) {
      // 正解
      this.problemData.proceed();
      this.setStats(prev => ({
        ...prev,
        correctTypes: prev.correctTypes + 1
      }));
      
      // 問題完了チェック
      if (this.problemData.completed) {
        this.endGame(this.stats());
      }
    } else {
      // ミス
      this.setStats(prev => ({
        ...prev,
        mistypes: prev.mistypes + 1
      }));
    }
    this.setStats(prev => ({
        ...prev,
        correctRate: Math.round(100 * prev.correctTypes / (prev.correctTypes + prev.mistypes))
    }));  
    // 表示更新
    this.updateDisplay();
  }


  private readonly fontSize = 20;
  private readonly lineHeight = 24;
  private readonly charWidth = 12;

  // 文字の表示処理
  private putCharAt(x: number, y: number, char: string, charWidth: number, backgroundColor: number, textColor: number): void {
    // 背景矩形
    if (backgroundColor !== 0x000000) {
      const bg = new Graphics();
      bg.rect(x - 2, y - 2, charWidth, this.lineHeight);
      bg.fill(backgroundColor);
      this.backgroundContainer.addChild(bg);
    }
    
    // 文字

    const style = new TextStyle({
      fontFamily: 'Consolas',
      fontSize: this.fontSize,
      fill: textColor,
    });

    const text = new Text(char, style);
    text.x = x;
    text.y = y;
    this.textContainer.addChild(text);
  }

  private readonly firstLetterPosX = 20;
  private readonly firstLinePosY = 20;  

  // 表示更新
  private updateDisplay(): void {
    console.log(\`updating display \${this.sceneSignature}...\`);
    if (!this.textContainer) return;
    
    // テキストコンテナをクリア
    this.textContainer.removeChildren().forEach(child => {
      child.destroy();
    });
    this.backgroundContainer.removeChildren().forEach(child => {
      child.destroy();
    });
    
    let currentX = this.firstLetterPosX;
    let currentY = this.firstLinePosY;

    // ProblemDataから現在位置より前の文字を取得
    for (const token of this.problemData.tokensBeforeCursor()) {
      for (const char of token.content) {
        // 改行処理
        if (char === '\n') {
          currentX = this.firstLetterPosX;
          currentY += this.lineHeight;
          continue;
        }
        // 文字の背景色を決定
        const backgroundColor = 0x22C55E; // 緑
        const textColor = 0x000000; // 黒
        // マルチバイト文字の場合は幅を2倍にする
        const width = this.charWidth * (this.isJapanese(char) ? 2 : 1);
        this.putCharAt(currentX, currentY, char, width, backgroundColor, textColor);
        currentX += width;
      }
    }

    // 現在入力位置を記録
    const cursorPositionX = currentX;
    const cursorPositionY = currentY;
    // 現在の文字を取得 改行は取得され得ないので，改行処理は入れない．
    {
      const backgroundColor = 0xEAB308; // 黄色
      const textColor = 0xeeeeee; // 灰色
      const currentChar = this.problemData.charAtCursor();
      // マルチバイト文字の場合は幅を2倍にする
      const width = this.charWidth * (this.isJapanese(currentChar) ? 2 : 1);
      this.putCharAt(currentX, currentY, currentChar, width, backgroundColor, textColor);
      currentX += width;
    }

    for (const token of this.problemData.tokensAfterCursor()) {
      for (const char of token.content) {
        // 改行処理
        if (char === '\n') {
          currentX = this.firstLetterPosX;
          currentY += this.lineHeight;
          continue;
        }
        const backgroundColor = 0x000000; // 透明
        const textColor = 0xFFFFFF; // 白
      // マルチバイト文字の場合は幅を2倍にする
        const width = this.charWidth * (this.isJapanese(char) ? 2 : 1);
        this.putCharAt(currentX, currentY, char, width, backgroundColor, textColor);
        currentX += width;
      }
    }

    const viewportHeight = this.pixiApp.renderer.height;
    const scrollOffsetY = Math.max(0, cursorPositionY - viewportHeight / 2);

    this.textContainer.y = -scrollOffsetY + 20;
    this.backgroundContainer.y = -scrollOffsetY + 20;

    const viewportWidth = this.pixiApp.renderer.width;
    const scrollOffsetX = Math.max(0, cursorPositionX - viewportWidth / 1.6);

    this.textContainer.x = -scrollOffsetX + 20;
    this.backgroundContainer.x = -scrollOffsetX + 20;

  }

  // https://stackoverflow.com/questions/4877326/how-can-i-tell-if-a-string-contains-multibyte-characters-in-javascript
  private isJapanese(testee: string): boolean {
    return /[\\u3041-\\u3096\\u30A1-\\u30FA]|[ー々〇〻\\u3400-\\u9FFF\\uF900-\\uFAFF]|[\\uD840-\\uD87F][\\uDC00-\\uDFFF]/
      .test(testee);
  }

  private keyEventHandler?: (e: KeyboardEvent) => void;
  MiddleCanvas(): JSXElement {
    let containerDiv!: HTMLDivElement;

    onMount(() => {
      if (containerDiv && this.pixiApp.canvas) {
        // canvasをappendChild
        containerDiv.appendChild(this.pixiApp.canvas);

        const pixiContainer = this.makePixiAppContent();
        this.arrangeContent(pixiContainer, containerDiv);

        if (this.keyEventHandler) {
          window.removeEventListener('keydown', this.keyEventHandler);
        }
        this.keyEventHandler = (e) => this.handleKeyInput(e);
        window.addEventListener('keydown', this.keyEventHandler);

        this.updateDisplay();

        window.addEventListener('resize', () => {
          this.arrangeContent(pixiContainer, containerDiv);
        });
      }
    });

    return (
      <div
        ref={el => containerDiv = el!}
        style={{ height: '100%', width: '100%', position: 'relative', overflow: 'hidden'}}
      />
    );
  }

  // PixiAppのコンテンツを作成する
  makePixiAppContent(): Container {
    const container = new Container();
    this.pixiApp.stage.addChild(container);

    // 背景コンテナ（ハイライト用）
    this.backgroundContainer = new Container();
    container.addChild(this.backgroundContainer);
    
    // テキストコンテナ
    this.textContainer = new Container();
    container.addChild(this.textContainer);

    return container;
  }

  // PixiAppのコンテンツを配置する
  arrangeContent(contentContainer: Container, canvasHolder: HTMLElement): void {
    this.pixiApp.renderer.resize(
      canvasHolder.clientWidth,
      canvasHolder.clientHeight
    );
    
  if (this.pixiApp.canvas) {
    this.pixiApp.canvas.style.width = '100%';
    this.pixiApp.canvas.style.height = '100%';
  }

    // コンテンツを中央に配置
    const padding = 0;
    contentContainer.x = padding;
    // contentContainer.y = padding;
    this.updateDisplay();
  }

  // コンポーネントを作成する
  makeComponent(): JSXElement {
    const [num1, setNum1] = createSignal(0);
    const [num2, setNum2] = createSignal(0);
    setInterval(() => setNum1((num1() + 10) % 255), 1000)
    setInterval(() => setNum2((num2() + 5) % 255), 1000)
    return <>
      <div class={styles.whole}>
        <div class={styles.whole2}>
          {/* <img src={metype} style={{"height": "12vh", "border-radius": "8px"}}/> */}
          <div style={{"color": \`rgb(\${num1()}, 180, \${num2()})\`}}>
            <h1>METYPE</h1>
          </div>
          <div class={styles.situation}>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>正解</div>
              <div style={{"font-size": "24px", "color": "#FCBAD3", "font-weight": "bold"}}>
                {this.stats().correctTypes}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>ミス</div>
              <div style={{"font-size": "24px", "color": "#FFFFD2", "font-weight": "bold"}}>
                {this.stats().mistypes}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>正解率</div>
              <div style={{"font-size": "24px", "color": "#A8D8EA", "font-weight": "bold"}}>
                {this.stats().correctRate}%
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>WPM</div>
              <div style={{"font-size": "24px", "color": "#AA96DA", "font-weight": "bold"}}>
                {this.stats().wpm}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>残り時間</div>
              <div style={{"font-size": "24px", "color": "#81f1ad", "font-weight": "bold"}}>
                {this.stats().timeRemaining}s
              </div>
            </div>
          </div>
        </div>

        {!this.gameStarted() && !this.gameEnded() && (
          <div class={styles.start}>
              <div class={styles.startText}>
                <p><span class={styles.bigkey}>Enter</span>キーを押してゲームを開始して下さい</p>
              </div>
              <div class={styles.startText}>
                <p>制限時間：{this.stats().totalTime}秒</p>
              </div>
              <div style={{"font-weight": "bold", "color": "#eee", "margin-top": "20px", "font-size": "1.5vw"}}>
                <p>ゲーム中、<span class={styles.smallkey}>Space</span>・<span class={styles.smallkey}>Enter</span>キーを押す必要はありません</p>
              </div>
          </div>
        )}

        {this.gameEnded() && (
          
          <div class={styles.end}>
            <div class={styles.containerStyle}>
                <div class={styles.resultStyle}> &lt;Result&gt; </div>
                <div>
                    <div class={styles.textStyle}> correct = <span class={styles.correct}>{this.stats().correctTypes}<span class={styles.Hover}>(property) correct: number</span> </span>byte;</div>
                </div>
                <div>
                    <div class={styles.textStyle}> miss = <span class={styles.miss}>{this.stats().mistypes}<span class={styles.Hover}>(property) miss: number</span> </span>byte;</div>
                </div>
                <div>
                    <div class={styles.textStyle}> correctRate = <span class={styles.correctRate}>{this.stats().correctRate}<span class={styles.Hover}>(property) correctRate: number</span> </span>%;</div>
                </div>
                <div>
                    <div class={styles.textStyle}> WPM = <span class={styles.wpm}>{this.stats().wpm}<span class={styles.Hover}>(property) WPM: number</span></span>;</div>
                </div>
                <div class={styles.resultStyle}> &lt;/Result&gt; </div>
            </div>
            <div class={styles.outerButton}>
                <button class={styles.homeButton} type="button" onclick={() => this.manager.changeSceneTo(SceneSig.selection)}>
                    <span>return</span> home;
                </button>
            </div>
          </div>
        )}

        <div class={styles.canvas}>
          {this.MiddleCanvas()}
        </div>
      </div>
    </>
  }
}`,
"typescript",
)
]

export default SourceCodeInstances;
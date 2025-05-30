import { onMount, createSignal, type JSXElement, type Accessor } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp, Text, TextStyle, Graphics } from 'pixi.js'
import SceneSig from "./fundation/signatures";
import styles from "./game.module.css";
import { type GameStats } from "../data_interface/user_data/types";
import { userDataManager, Host } from "../const.ts";
import metype from "/images/METYPE.png";

import { Problem } from "../game_data/problems.ts";
import SourceCodeInstances from "../game_data/instances.ts";

// ゲームデータプロバイダーのモック
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
  /** @deprecated problemDataが現在位置の情報を持つようになったためdeprecated */
  private currentPosition = 0;
  private textContainer!: Container;
  private backgroundContainer!: Container;
  
  // Solid.jsシグナルでリアクティブな状態管理
  public statsSignal = createSignal<GameStats>({
    correctTypes: 0,
    mistypes: 0,
    timeRemaining: 60,
    correctRate: 0,
    wpm: 0,
    totalTime: 60
  });
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
    console.log(`Preloading ${this.sceneSignature}...`);

    const pixiApp = new PixiApp();
    await pixiApp.init({ 
      backgroundAlpha: 0 
    })

    await Promise.all([
      (async () => {
        // 問題データの読み込み
        this.problemData = GameDataProvider.getProblem();
      })(),
    ]);
    this.pixiApp = pixiApp;
  }

  // ゲーム開始
  private startGame(): void {
    if (this.gameStarted()) return;
    
    this.setGameStarted(true);
    this.setGameEnded(false);
    
    // タイマー開始
    this.gameTimer = window.setInterval(() => {
      const currentStats = this.stats();
      if (currentStats.timeRemaining <= 0) {
        this.endGame(this.statsSignal[0]());
        return;
      }
      
      this.setStats(prev => ({
        ...prev,
        // timeRemaining: prev.timeRemaining - 6
                timeRemaining: prev.timeRemaining 
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
        this.endGame(this.statsSignal[0]());
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
  private putCharAt(x: number, y: number, char: string, backgroundColor: number, textColor: number): void {
    // 背景矩形
    if (backgroundColor !== 0x000000) {
      const bg = new Graphics();
      bg.rect(x - 2, y - 2, this.charWidth, this.lineHeight);
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
    console.log(`updating display ${this.sceneSignature}...`);
    if (!this.textContainer) return;
    
    // テキストコンテナをクリア
    this.textContainer.removeChildren();
    this.backgroundContainer.removeChildren();
    
    console.log(this.problemData)
    
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
        this.putCharAt(currentX, currentY, char, backgroundColor, textColor);
        currentX += this.charWidth;
      }
    }

    // 現在入力位置を記録
    const curosrPositionX = currentX;
    const cursorPositionY = currentY;
    // 現在の文字を取得 改行は取得され得ないので，改行処理は入れない．
    {
      const backgroundColor = 0xEAB308; // 黄色
      const textColor = 0xeeeeee; // 灰色
      const currentChar = this.problemData.charAtCursor();
      this.putCharAt(currentX, currentY, currentChar, backgroundColor, textColor);
      currentX += this.charWidth;
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
        this.putCharAt(currentX, currentY, char, backgroundColor, textColor);
        currentX += this.charWidth;
      }
    }

    const viewportHeight = this.pixiApp.renderer.height;
    const scrollOffsetY = Math.max(0, cursorPositionY - viewportHeight / 2);

    this.textContainer.y = -scrollOffsetY + 40;
    this.backgroundContainer.y = -scrollOffsetY + 40;

    const viewportWidth = this.pixiApp.renderer.width;
    const scrollOffsetX = Math.max(0, curosrPositionX - viewportWidth / 2);

    this.textContainer.x = -scrollOffsetX + 20;
    this.backgroundContainer.x = -scrollOffsetX + 20;

  }

MiddleCanvas(): JSXElement {
  let containerDiv!: HTMLDivElement;

  onMount(() => {
    if (containerDiv && this.pixiApp.canvas) {
      // canvasをappendChild
      containerDiv.appendChild(this.pixiApp.canvas);

      const pixiContainer = this.makePixiAppContent();
      this.arrangeContent(pixiContainer, containerDiv);

      window.addEventListener('keydown', (e) => this.handleKeyInput(e));

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
    return <>
      <div class={styles.whole}>
        <div class={styles.whole2}>
          <img src={metype} style={{"height": "12vh", "border-radius": "8px"}}/>
          <div class={styles.situation}>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>正解</div>
              <div style={{"font-size": "24px", "color": "#22C55E", "font-weight": "bold"}}>
                {this.stats().correctTypes}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>ミス</div>
              <div style={{"font-size": "24px", "color": "#EF4444", "font-weight": "bold"}}>
                {this.stats().mistypes}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>正解率</div>
              <div style={{"font-size": "24px", "color": "#hd2948", "font-weight": "bold"}}>
                {this.stats().correctRate}%
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>WPM</div>
              <div style={{"font-size": "24px", "color": "#75f483", "font-weight": "bold"}}>
                {this.stats().wpm}
              </div>
            </div>
            <div class={styles.situationExplain}>
              <div class={styles.situationExplainTag}>残り時間</div>
              <div style={{"font-size": "24px", "color": "#EAB308", "font-weight": "bold"}}>
                {this.stats().timeRemaining}s
              </div>
            </div>
          </div>
        </div>

        {!this.gameStarted() && !this.gameEnded() && (
          <div class={styles.start}>
              <div class={styles.startText}>
                <h3>Enterを押してゲームを開始して下さい</h3>
              </div>
              <div class={styles.startText}>
                <h3>制限時間：{this.stats().totalTime}秒</h3>
              </div>
              <div class={styles.startText}>
                <p>ゲーム中、<span class={styles.key}>Space</span>・<span class={styles.key}>Enter</span>キーを押す必要はありません</p>
              </div>
          </div>
        )}

        {this.gameEnded() && (
          
          <div class={styles.end}>
            <div class={styles.containerStyle}>
                <div class={styles.resultStyle}> &lt;Result&gt; </div>
                <div>
                    <div class={styles.textStyle}> correct = <span style={{"color": "#22C55E"}}>{this.stats().correctTypes} </span>byte</div>
                </div>
                <div>
                    <div class={styles.textStyle}> miss = <span style={{"color": "#22C55E"}}>{this.stats().mistypes} </span>byte</div>
                </div>
                <div>
                    <div class={styles.textStyle}> correctRate = <span style={{"color": "#22C55E"}}>{this.stats().correctRate} </span>%</div>
                </div>
                <div>
                    <div class={styles.textStyle}> WPM = <span style={{"color": "#22C55E"}}>{this.stats().wpm}</span></div>
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

        <div style={{
          "background": "#0f0f0f",
          "border-radius": "8px",
          // "padding": "20px",
          "border": "20px solid #333",
          "border-color": "#333",
          "min-height": "400px",
          "position": "relative"
        }}>
          {this.MiddleCanvas()}
        </div>
      </div>
    </>
  }
}
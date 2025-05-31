import { onMount, createSignal, type JSXElement, type Accessor } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp, Text, TextStyle, Graphics } from 'pixi.js'
import SceneSig from "./fundation/signatures";
import styles from "./game.module.css";
import { type GameStats } from "../data_interface/user_data/types";
import { userDataManager, Host } from "../const.ts";
import metype from "/images/METYPE.png";

import { SourceCode, SourceCodeInstances } from "../game_data/problems.ts";

// ゲームデータプロバイダーのモック
class GameDataProvider {
  static getProblem(): SourceCode {
    // ProblemInstancesからランダムに問題を取得して返す．
    return SourceCodeInstances[
      Math.floor(Math.random() * SourceCodeInstances.length)
      % SourceCodeInstances.length
    ];
  }
}

// ゲーム統計の型


export default class GameScene extends SceneBase {
    
  constructor(manager: SceneManager) {
    super(manager, SceneSig.game);
  }
  private pixiApp!: PixiApp;
  private problemData!: SourceCode;
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
    
    // await Promise.all([
    //   (async () => {
    //     // 問題データの読み込み
    //     console.log("loading problem data ")
    //     this.problemData = GameDataProvider.getMockProblem();
    //     console.log(this.problemData)
    //     console.log("loaded problem data ")
    //   })(),
      
    //   (async () => {
    //     // その他の初期化処理
    //     this.currentPosition = 0;
    //   })(),
      
    //   // PixiAppの初期化
    //   pixiApp.init({ 
    //     backgroundAlpha: 0 
    //   }),
    // ]);

    await pixiApp.init({ 
      backgroundAlpha: 0 
    })

    await Promise.all([
      (async () => {
        // 問題データの読み込み
        this.problemData = GameDataProvider.getProblem();
      })(),
      
      (async () => {
        // その他の初期化処理
        this.currentPosition = 0;
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
    
    const targetChar = this.problemData.content[this.currentPosition];
    
    if (event.key === targetChar) {
      // 正解
      this.currentPosition++;
      this.setStats(prev => ({
        ...prev,
        correctTypes: prev.correctTypes + 1
      }));

      
      // 問題完了チェック
      if (this.currentPosition >= this.problemData.content.length) {
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

  // 表示更新
  private updateDisplay(): void {
    console.log(`updating display ${this.sceneSignature}...`);
    if (!this.textContainer) return;
    
    // テキストコンテナをクリア
    this.textContainer.removeChildren();
    this.backgroundContainer.removeChildren();
    
    console.log(this.problemData)
    const content = this.problemData.content;
    const fontSize = 20;
    const lineHeight = 24;
    const charWidth = 12;
    


    let currentX = 20;
    let currentY = 20;
    let currentPositionX = 20;
    let currentPositionY = 20; // 現在入力位置のY座標を記録

    
    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      
      // 改行処理
      if (char === '\n') {
        currentX = 20;
        currentY += lineHeight;
        continue;
      }
          if (i === this.currentPosition) {
      currentPositionY = currentY;
      currentPositionX = currentX;
    }
      // 文字の背景色を決定
      let backgroundColor = 0x000000; // デフォルト（透明）
      let textColor = 0xFFFFFF; // 白
      
      if (i < this.currentPosition) {
        // 入力済み（緑）
        backgroundColor = 0x22C55E;
        textColor = 0x000000;
      } else if (i === this.currentPosition) {
        // 現在位置（黄色）
        backgroundColor = 0xEAB308;
        textColor = 0xeeeeee;
      }
      
      // 背景矩形
      if (backgroundColor !== 0x000000) {
        const bg = new Graphics();
        bg.rect(currentX - 2, currentY - 2, charWidth, lineHeight);
        bg.fill(backgroundColor);
        this.backgroundContainer.addChild(bg);
      }
      
      // 文字

      const style = new TextStyle({
        fontFamily: 'Consolas',
        fontSize: fontSize,
        fill: textColor,
      });

      const text = new Text(char, style);
      text.x = currentX;
      text.y = currentY;
      this.textContainer.addChild(text);
      
      currentX += charWidth;
      if (this.problemData.content[this.currentPosition] === "\n"){
        this.currentPosition += 1;
      }
      if (this.problemData.content[this.currentPosition] === " "){
        this.currentPosition += 1;
      }
      if (this.currentPosition === content.length) {
        this.endGame(this.statsSignal[0]());
      }
    }    
    const viewportHeight = this.pixiApp.renderer.height;
    const scrollOffsetY = Math.max(0, currentPositionY - viewportHeight / 2);

    this.textContainer.y = -scrollOffsetY + 40;
    this.backgroundContainer.y = -scrollOffsetY + 40;

    const viewportWidth = this.pixiApp.renderer.width;
    const scrollOffsetX = Math.max(0, currentPositionX - viewportWidth / 2);

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
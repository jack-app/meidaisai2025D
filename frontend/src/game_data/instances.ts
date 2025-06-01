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
"view_import",
`// ViewRootを作るために必要なモジュールをインポート
import { createSignal, Show } from 'solid-js'
import FixedAspectRatio from './components/fixedAspectRatio'

import type SceneBase from './scenes/fundation/sceneBase'

import LoadingScene from './scenes/loading'
import instanciateAllScenes from './scenes/fundation/instanciate'
import SceneSig from './scenes/fundation/signatures'
// 全シーンで共通のSceneManagerを使用する．
import { sceneManager } from './const'`,
"typescript"
),
new SourceCode(
"index",
`// htmlから呼びだされるスクリプトのエントリーポイント
/* @refresh reload */
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
"typescript"
),
new SourceCode(
"index",
`// 全プログラムを通して使用される共通の値やインスタンス
import SceneManager from './scenes/fundation/sceneManager';
import type IUserDataManager from './data_interface/user_data/interface';
import UserDataManager from './data_interface/user_data/userData'; // 実装版を使用

const host = new URL(location.href).host

const isDev = 
    host.startsWith('localhost') 
    || host.startsWith('127.0.0.1') 
    || host.startsWith('::1')

// Singleton - 実装版のUserDataManagerを使用
export const userDataManager: IUserDataManager = new UserDataManager()
export const sceneManager = new SceneManager()
`,
"typescript"
),
new SourceCode(
"explanation",
`// 説明画面
makeComponent(): JSXElement {
  return <div style={
      {
          position: 'relative',
          width: '100%',
          height: '100%',
      }
  }>
  <div style={{
      "width": '100%',
      "height": '100%',
      "background-image": 'url("/background.png")',
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
      "width": '70%',
      "height":'18%',
      "background-color":'#ECEBEE',
      "position":'absolute',
      "top":'19%',
      "left":'20%',
      "font-size": '5vh',
      "font-weight": 'bold',
      "display": 'flex',
      "align-items": 'center',
      "padding-left":'3%',
      "color":'black'
      }}>
      
  </div>
  </div>
}`,
"typescript"
),
new SourceCode(
"selection",
`makeComponent(): JSXElement {
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
          {label: "setting", sig: SceneSig.setting}, 
          {label:"explanation", sig:SceneSig.explanation}, 
          {label: "start game", sig: SceneSig.game}, 
          {label: "record", sig: SceneSig.record}
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
}`,
"typescript"
),
new SourceCode(
"setting",
`// 設定画面
export default class SettingScene extends SceneBase {  
  
  // ...

  makeComponent(): JSXElement {
      return <Background>
          <Header onClose={() => this.manager.changeSceneTo(SceneSig.selection)} />
          <Body 
              eventListeners={{
                  timelimit: (checked) => {
                      this.setting.timeLimitPresentation = checked;
                      userDataManager.setUserSetting(this.setting);
                  }
              }}
              initialSetting={this.setting}
          />
      </Background>
  }
}

function Background(props: {children: JSXElement}) {
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
            {props.children}
        </div>
    );
}
`,
"typescript"
),
new SourceCode(
"title",
`export default class TitleScene extends SceneBase {
  // ...

  // Googleログインボタンのクリックハンドラー
  private async handleGoogleLogin() {
    try {
      const success = await userDataManager.signInWithGoogle();
    } catch (error) {
      console.error(error);
    }
  }

  makeComponent(): JSXElement {
    console.log("makeComponent called");

    const userState = userDataManager.useUserState();

    // ログイン状態が変わったら自動的に遷移
    createEffect(() => {
      if (userState.isLoggedIn) {
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
          
        </div>
      </div>
    );
  }
}`,
"typescript",
),
new SourceCode(
"instanciate_scenes",
`import type SceneManager from "./sceneManager";
import ExampleScene from "../example";
import ExplanationScene from "../explanation";
import GameScene from "../game";
import RecordScene from "../record";
import SelectionScene from "../selection";
import SettingScene from "../setting";
import TitleScene from "../title";

export default function instanciateAllScenes(manager: SceneManager) {
    // ここですべてのシーンをインスタンス化する
    new ExampleScene(manager);
    new ExplanationScene(manager);
    new GameScene(manager);
    new RecordScene(manager);
    new SelectionScene(manager);
    new SettingScene(manager);
    new TitleScene(manager);
}`,
"typescript"
),
new SourceCode(
"scene_manager",
`import type SceneBase from "./sceneBase";
import SceneSig from "./signatures";

export default class SceneManager {
    // シーンの一覧を保管する．
    private readonly scenes: Map<SceneSig, SceneBase> = new Map();

    // シーンの変更を監視するためのコールバック関数を設定する．
    private sceneChangeCallback: ((scene: SceneBase) => void)|null = null;
    bindSceneChangeCallback(callback: (scene: SceneBase) => void) {
        this.sceneChangeCallback = callback;
        if (this.currentScene) {
            this.sceneChangeCallback(this.currentScene);
        }
    }
    // 現在のシーンを保管/更新する
    private currentScene: SceneBase | null = null;
    private async updateCurrentScene(scene: SceneBase) {
        const previousScene = this.currentScene;
        await scene.load();
        this.currentScene = scene;
        if (this.sceneChangeCallback) {
            this.sceneChangeCallback(scene);
        }
        this.currentScene.activate();
        previousScene?.deactivate();
    }

    /// シーンを追加する．SceneBaseから呼ばれる．
    addScene(scene: SceneBase) {
        if (this.scenes.has(scene.sceneSignature)) {
            throw new Error();
        }
        if (scene.options.initialScene) {
            if (this.currentScene) {
                throw new Error();
            }
            this.updateCurrentScene(scene);
        }
        this.scenes.set(scene.sceneSignature, scene);
    }

    /// 現在のシーンをシーンシグネチャで更新する．
    changeSceneTo(sceneSignature: SceneSig) {
        if (!this.scenes.has(sceneSignature)) {
            throw new Error();
        }
        this.updateCurrentScene(this.scenes.get(sceneSignature)!);
    }
}`,
"typescript"
),
new SourceCode(
"scene_base",
`import type SceneManager from "./sceneManager";
import type { JSXElement } from "solid-js";
import SceneSig from "./signatures";

export default abstract class SceneBase {
    constructor(
        public readonly manager: SceneManager,
        public readonly sceneSignature: SceneSig, 
        public readonly options: {
            initialScene?: boolean, 
            needsToBeInitialized?: boolean
        } = {}) 
    {
        const defaultOptions = {
            initialScene: false, 
            needsToBeInitialized: false
        }
        this.options = {...defaultOptions, ...options};
        
        this.manager.addScene(this);
        this.preload();
    }

    get isInitialized() {
        return !this.options.needsToBeInitialized;
    }
    set isInitialized(value: boolean) {
        this.options.needsToBeInitialized = !value;
    }

    /**
     * シーンが表示される前に必要なリソースの事前ロード処理を行います．
     * この処理はシーンのインスタンス化と同時に呼び出されます．シーンの表示直前に呼び出したい処理はmakeComponentで実装してください．
     * 
     * 必要に応じてサブクラスでオーバーライドしてください．
     */
    async preload(): Promise<void> {}

    /**
     * シーンが表示される前に呼び出されます．
     * このメソッドの処理が終わるまで，シーンは表示されないので，重い処理をしないように注意してください．
     * 
     * また，このメソッドの実行時点ではコンポーネントは作成されていません．
     * 
     * 非同期が必要でなければ，makeComponentに実装しても良いでしょう．
     * 
     * 必要に応じてサブクラスでオーバーライドしてください．
     */
    async load(): Promise<void> {}

    /**
     * シーンが表示されたときに呼び出されます．
     * また，このメソッドの実行時点ではコンポーネントは作成されています．
     * 
     * このメソッドを使う代わりに，makeComponent内でonMountを使ってもよいでしょう．
     * 
     * 必要に応じてサブクラスでオーバーライドしてください．
     */
    async activate(): Promise<void> {}

    /**
     * シーンが非表示になったときに呼び出されます．
     * また，このメソッドの実行時点でコンポーネントは破棄されています．
     * 
     * このメソッドを使う代わりに，makeComponent内でonCleanupを使ってもよいでしょう．
     * 
     * 必要に応じてサブクラスでオーバーライドしてください．
     */
    async deactivate(): Promise<void> {}

    /**
     * シーンを表示するときに呼び出されます．
     * コンポーネントを作成して返却してください．
     */
    abstract makeComponent(): JSXElement;
}`,
"typescript"
),
new SourceCode(
"fixedAspectRatio",
`import { createSignal, onMount, type JSX } from 'solid-js';
import Align from './align';

type FixedAspectRatioProps = {
    children: JSX.Element,
    width: number,
    height: number,
}

/**
 * 固定アスペクト比のコンテナコンポーネントです。
 * 
 * 指定された幅（width）と高さ（height）からアスペクト比を計算し、
 * 親要素のサイズに応じて子要素のサイズを自動的に調整します。
 * ウィンドウサイズの変更にも対応し、常に指定したアスペクト比を維持します。
 * 
 * @param children - 固定アスペクト比内に表示するReactノード
 * @param width - 基準となる幅（ピクセル単位）
 * @param height - 基準となる高さ（ピクセル単位）
 */
export default function FixedAspectRatio(prop: FixedAspectRatioProps) {
    const ratio = prop.height / prop.width;

    const [getHeight, setHeight] = createSignal(prop.width);
    const [getWidth, setWidth] = createSignal(prop.height);

    let holder!: HTMLDivElement;

    onMount(() => {
        const {width, height} = calc(holder, ratio)
        setWidth(width)
        setHeight(height)
        window.addEventListener('resize', () => {
            const {width, height} = calc(holder, ratio)
            setWidth(width)
            setHeight(height)
        })
    })

    return <div
        ref={holder}
        style={{
            position: 'relative',
            width: '100%',
            height: '100%',
        }}>
            <Align horizontal="center" vertical="center">
                <div 
                    children={prop.children}
                    style={{
                        width: \`\${getWidth()}px\`,
                        height: \`\${getHeight()}px\`,
                        overflow: 'hidden',
                    }}
                />
            </Align>
        </div>
}

function calc(holder: HTMLElement, ratio: number) {
    const maxHeight = holder.clientHeight
    const maxWidth = holder.clientWidth

    let height = maxWidth * ratio
    let width = maxWidth

    if (height > maxHeight) {
        height = maxHeight
        width = maxHeight / ratio
    }

    return {width, height}
}`,
"typescript"
),
new SourceCode(
"userDataManager auth",
`// ユーザー状態を更新
private updateUserState(state: UserState) {
    this.userState = state;
    this.listeners.forEach((listener) => listener(state));
}

private async fetchDataFromServer() {
    const token = await this.getAuthToken();
    if (!token) throw new Error();

    const response = await fetch(
        \`\${Host.functions.href}/api/user\`, {
        headers: {
            'Authorization': \`Bearer \${token}\`
        }
    });

    if (!response.ok) {
        throw new Error();
    }

    const data = await response.json();
    this.userSetting = data.setting ?? {
        timeLimitPresentation: true,
        BGM: true,
        typingSound: true,
        otherSoundEffect: true
    };
    this.recordSummary = data.records ?? {
        totalTypeByte: 0,
        bestWPM: 0
    };

    return {userSetting: this.userSetting!, recordSummary: this.recordSummary!};
}`,
"typescript"
),
new SourceCode(
"",
`// ゲーム記録を保存
async putRecord(record: GameStats): Promise<void> {
    // キャッシュを更新
    this.lastRecord = record;

    // ローカルサマリーを更新
    if (this.recordSummary) {
        this.recordSummary.totalTypeByte += record.correctTypes;
        this.recordSummary.bestWPM = Math.max(
            this.recordSummary.bestWPM,
            record.wpm
        );
    }

    // ログインしていなければサーバーには保存しない
    if (!this.userState.isLoggedIn) return;

    try {
        const token = await this.getAuthToken();
        if (!token) throw new Error();

        const recordData = {
            correctTypes: record.correctTypes,
            mistypes: record.mistypes,
            correctRate: record.correctRate,
            timeRemaining: record.timeRemaining,
            wpm: record.wpm,
            totalTime: record.totalTime,
            recordedAt: new Date().toISOString()
        };

        const response = await fetch(
            \`\${Host.functions.href}/api/records\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
            },
            body: JSON.stringify(recordData)
        });

        if (!response.ok) {
            throw new Error();
        }
    } catch (error) {
        console.error(error);
    }
}`,
"typescript"
),
new SourceCode(
"getRecordSummary",
`// 記録サマリーを取得
async getRecordSummary(): Promise<RecordSummary> {
    // キャッシュがあれば返す
    if (this.recordSummary) {
        return this.recordSummary;
    }

    // ログインしていない場合は空のサマリーを返す
    if (!this.userState.isLoggedIn) {
        return {
            totalTypeByte: 0,
            bestWPM: 0
        };
    }

    // ログインしていればサーバに問い合わせて返す
    try {
        const { recordSummary } = await this.fetchDataFromServer();
        return recordSummary;
    } catch (error) {
        console.error('サマリー取得エラー:', error);
        // エラーの場合は空のサマリーを返す
        return {
            totalTypeByte: 0,
            bestWPM: 0
        };
    }
}`,
"typescript"
),
new SourceCode(
"putRecord",
`// ゲーム記録を保存
async putRecord(record: GameStats): Promise<void> {
    // キャッシュを更新
    this.lastRecord = record;

    // ローカルサマリーを更新
    if (this.recordSummary) {
        this.recordSummary.totalTypeByte += record.correctTypes;
        this.recordSummary.bestWPM = Math.max(
            this.recordSummary.bestWPM,
            record.wpm
        );
    }

    // ログインしていなければサーバーには保存しない
    if (!this.userState.isLoggedIn) return;

    try {
        const token = await this.getAuthToken();
        if (!token) throw new Error();

        const recordData = {
            correctTypes: record.correctTypes,
            mistypes: record.mistypes,
            correctRate: record.correctRate,
            timeRemaining: record.timeRemaining,
            wpm: record.wpm,
            totalTime: record.totalTime,
            recordedAt: new Date().toISOString()
        };

        const response = await fetch(
            \`\${Host.functions.href}/api/records\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
            },
            body: JSON.stringify(recordData)
        });

        if (!response.ok) {
            throw new Error('ゲーム記録の保存に失敗しました');
        }
    } catch (error) {
        console.error('記録保存エラー:', error);
    }
}`,
"typescript"
),
new SourceCode(
"functions-routing",
`/* --------------------------------
RESTful APIのルーティングを設定する
----------------------------------- */

import { type Express } from 'express';

import { test } from "./test";
import { allowCors, authMiddleware } from "./auth";
import { getUserData, setUserData, addGameRecord, getLatestGameRecords} from "./userData";

export default function (app: Express) {
    // 接続テスト用エンドポイント
    app.get("/api/", test);

    // // ユーザ登録用エンドポイント
    // app.post("/api/signup", signup);

    // // ユーザ認証用エンドポイント
    // app.post("/api/login", login);

    // ユーザデータ取得用エンドポイント
    app.get("/api/user", allowCors, authMiddleware, getUserData);

    // ユーザデータ更新用エンドポイント
    app.post("/api/user", allowCors, authMiddleware, setUserData);

    //ゲーム記録保存用エンドポイント
    app.post("/api/records", allowCors, authMiddleware, addGameRecord);

    //最新のゲーム記録取得用エンドポイント
    app.get("/api/records/latest", allowCors, authMiddleware, getLatestGameRecords);
}`,
"typescript"
),
new SourceCode(
"functions-middleware",
`import type { Request, Response } from 'express';
import { getApp } from 'firebase-admin/app';
const app = getApp();

// authの利用
import { getAuth } from 'firebase-admin/auth';
const auth = getAuth(app);

// firestoreの利用
// import { getFirestore } from 'firebase-admin/firestore';
// const db = getFirestore(app);

// 認証済みのリクエストかをチェックするミドルウェア
export async function authMiddleware(req: Request, res: Response, next: Function) {
    console.log('authMiddleware called');
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'token missing' });
        }

        const idToken = authHeader.split('Bearer ')[1];
        const decodedToken = await auth.verifyIdToken(idToken);
        req.user = decodedToken; //user情報をリクエストに追加
        return next(); 
    } catch (error) {
        return res.status(401).json({ error: 'invalid token' });
    }
}

// 開発環境向けにクロス-オリジンリクエストを許可するミドルウェア
export async function allowCors(req: Request, res: Response, next: Function) {
    // ローカルホストの場合全てのポートを許可
    console.log('allowing cors access');
    res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:5000');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    
    return next();
}`,
"typescript"
),
new SourceCode(
"getsetUserData",
`async function getUserData(req: Request, res: Response) {
    console.log('getUserData called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'missing credentials' });
        }

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(200).json({
                setting: {
                    timeLimitPresentation: true,
                    BGM: true,
                    typingSound: true,
                    otherSoundEffect: true
                },
                records: {
                    totalTypeByte: 0,
                    bestWPM: 0
                }
            });
        }

        return res.status(200).json(userDoc.data());
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' });
    }
}

async function setUserData(req: Request, res: Response) {
    console.log('setUserData called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'missing credentials' });
        }
        
        const { setting, records } = req.body;

        const updateData: any = {};

        if (setting) {
            updateData.setting = setting;
        }

        if (records) {
            updateData.records = records;
        }

        await db.collection('users').doc(userId).set(updateData, { merge: true });

        return res.status(200).json({ success: true });
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' });
    }    
}`,
"typescript"
),
new SourceCode(
"addGetRecrd",
`async function addGameRecord(req: Request, res: Response) {
    console.log('addGameRecord called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'missing credentials' });
        }

        const gameRecord = req.body;

        const recordWithTimestamp = {
            ...gameRecord,
            recordedAt: new Date()
        };

        const recordRef = await db.collection('users').doc(userId).collection('gameRecords').add(recordWithTimestamp);

        const userRef = db.collection('users').doc(userId);
        let totalTypeByte, bestWPM;

        await db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data() || {};
            const currentRecords = userData.records || { totalTypeByte: 0, bestWPM: 0 };

            totalTypeByte = (currentRecords.totalTypeByte || 0) + gameRecord.correctTypes;
            const byte = gameRecord.correctTypes;
            bestWPM = Math.max(currentRecords.bestWPM || 0, byte);

            transaction.set(userRef, {
                records: {
                    totalTypeByte,
                    bestWPM
                }
            }, { merge: true });
        });

        return res.status(200).json({
            success: true,
            recordId: recordRef.id,
            totalTypeByte,
            bestWPM
        });
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' });
    }
}

async function getLatestGameRecords(req: Request, res: Response) {
    console.log('getLatestGameRecords called');
    try {
        const userId = req.user?.uid;
        if (!userId) {
            return res.status(401).json({ error: 'missing credentials' });
        }

        const recordsSnapshot = await db.collection('users').doc(userId).collection('gameRecords')
            .orderBy('recordedAt', 'desc')
            .limit(1)
            .get();

        if (recordsSnapshot.empty) {
            return res.status(404).json({ error: 'record not found' });
        }
        
        const latestRecord = recordsSnapshot.docs[0].data();
        return res.status(200).json(latestRecord);
    } catch (error) {
        return res.status(500).json({ error: 'internal server error' });
    }
}`,
"typescript"
),
new SourceCode(
"problemType",
`export class Token {
  constructor(
    public content: string,
    public scope: Scope
  ) {}
  length(): number {
    return this.content.length;
  }
  toString(): string {
    return this.content;
  }
}

// highlight.jsの字句解析情報を利用するためのhack
type SerialToken = {
    children: SerialToken[];
    scope: string;
} | string;
type TokenTreeEmitter = {rootNode: {children: SerialToken[]}};


// 問題データの型定義
export class SourceCode {
  public tokens: Token[];
  
  constructor(public id: string, public content: string, public language: string) {
    // ちょっとhackyすぎ？
    const tokenTree = hljs.highlight(content, { language })._emitter as unknown as TokenTreeEmitter;
    this.tokens = [];
    for (const token of tokenTree.rootNode.children) {
      this.pushToken(token);
    }
  }

  // flattenのため再帰関数を使用
  private pushToken(token: SerialToken, superScope?: Scope) {
    // highlight.jsのscope -> 独自のScope(上で定めたもの)へ
    if (typeof token === "string") {
      this.tokens.push(new Token(token, superScope || Scope.PLANE));
      return;
    }

    for (const child of token.children) {
      this.pushToken(child, scopeAsEnum(token.scope));
    }
  }

  generateProblem(): Problem {
    return new Problem(this);
  }
}
export class Problem {
  private tokenIndex: number = 0;
  private charIndex: number = 0;
  public completed: boolean = false;
  constructor(
    public source: SourceCode,
  ) {
    // 初期状態でスキップするべき文字・トークンを飛ばす
    this.skip();
  }

  private proceedOneToken() {
    if (this.completed) return;
    this.tokenIndex++;
    this.charIndex = 0;
    // トークンが無くなったらcompletedを立てる．
    if (this.tokenIndex >= this.source.tokens.length) {
      this.completed = true;
      this.tokenIndex = this.source.tokens.length - 1; // 最後のトークンに留まる
      this.charIndex = this.source.tokens[this.tokenIndex].length() - 1; // 最後の文字に留まる
    }
  }

  get currentToken(): Token {
    return this.source.tokens[this.tokenIndex];
  }

  private proceedOneChar() {
    if (this.completed) return;
    this.charIndex++;
    // charIndexがトークンをオーバーしたら次のトークンへ
    if (this.charIndex >= this.source.tokens[this.tokenIndex].length()) {
      this.proceedOneToken();
    }
  }

  get currentChar(): string {
    if (this.completed) return "";
    return this.source.tokens[this.tokenIndex].content[this.charIndex];
  }

  private get currentCharShouldBeSkipped() {
    return [
      " ", "\t", "\n", undefined // undefinedは空のトークンに入ったときに対応
    ].includes(this.currentChar)
  }
  private get currentTokenShouldBeSkipped() {
    return [Scope.comment].includes(this.currentToken.scope);
  }

  private skip() {
    // スキップ条件が満たされている限り進め続ける
    while (
      this.currentCharShouldBeSkipped
      || this.currentTokenShouldBeSkipped
    ) {
      // 空白・タブ文字・改行は飛ばす
      while (this.currentCharShouldBeSkipped) {
        this.proceedOneChar();
      }
      // コメントトークンは飛ばす
      while (this.currentTokenShouldBeSkipped) {
        this.proceedOneToken();
      }
    }
  }

  proceed(): void {
    if (this.completed) return;
    this.proceedOneChar(); // とりあえず一文字進める

    this.skip(); // スキップするべき文字・トークンを飛ばす
  }

  charAtCursor(): string {
    return this.currentChar;
  }
  tokensBeforeCursor(): Token[] {
    return [
      ...this.source.tokens.slice(0, this.tokenIndex), 
      new Token(
        this.currentToken.content.slice(0, this.charIndex),
        this.currentToken.scope,
      ) // 最後のトークンが入力中のトークン
    ]
  }
  tokensAfterCursor() {
    return [
      new Token( // 最初のトークンが入力中のトークン
        this.currentToken.content.slice(this.charIndex+1),
        this.currentToken.scope
      ),
      ...this.source.tokens.slice(this.tokenIndex + 1)
    ]
  }
}`,
"typescript"
),
new SourceCode(
"game_startGame",
`// ゲーム開始
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
}`,
"typescript"
),
new SourceCode(
"game_handleKeyInput",
`// キー入力処理
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
}`,
"typescript"
),
new SourceCode(
"updateDisplay",
`private readonly fontSize = 20;
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
  this.textContainer.removeChildren();
  this.backgroundContainer.removeChildren();
  
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
  const curosrPositionX = currentX;
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

  this.textContainer.y = -scrollOffsetY + 40;
  this.backgroundContainer.y = -scrollOffsetY + 40;

  const viewportWidth = this.pixiApp.renderer.width;
  const scrollOffsetX = Math.max(0, curosrPositionX - viewportWidth / 2);

  this.textContainer.x = -scrollOffsetX + 20;
  this.backgroundContainer.x = -scrollOffsetX + 20;

}`,
"typescript"
)
]

export default SourceCodeInstances;
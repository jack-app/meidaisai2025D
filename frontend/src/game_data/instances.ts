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
    // 表示されるコードをタイピングしましょう。  
  </div>
  // ...
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
`
export default class TitleScene extends SceneBase {
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
          // ...
        </div>
      </div>
    );
  }
}`,
"typescript",
)
]

export default SourceCodeInstances;
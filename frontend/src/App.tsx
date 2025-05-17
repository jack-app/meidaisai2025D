import { createSignal, Show } from 'solid-js'
import './App.css'

import SceneManager from './scenes/sceneManager'
import type SceneBase from './scenes/sceneBase'

import LoadingScene from './scenes/loading'
import ExampleScene from './scenes/example'
import FixedAspectRatio from './components/fixedAspectRatio'

function App() {
  // 全シーンで共通のSceneManagerを作成する
  const sceneManager = new SceneManager();

  /********************** 
   * ここでシーンを追加する * 
   * ********************/
  const loadingScene = new LoadingScene(sceneManager)
  new ExampleScene(sceneManager)

  // シーンマネージャーがシーンを切り替えれるように設定する．
  const [getScene, setScene] = createSignal<SceneBase|null>(null);
  sceneManager.bindSceneChangeCallback(setScene);

  // 以下表示する内容
  return (
    <FixedAspectRatio width={1600} height={900}>
      <Show when={getScene()} fallback={loadingScene.makeComponent()}>
        {getScene()!.makeComponent()}
      </Show>
    </FixedAspectRatio>
  )
}

export default App

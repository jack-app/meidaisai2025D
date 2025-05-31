import { createSignal, Show } from 'solid-js'
import FixedAspectRatio from './components/fixedAspectRatio'

import type SceneBase from './scenes/fundation/sceneBase'

import LoadingScene from './scenes/loading'
import instanciateAllScenes from './scenes/fundation/instanciate'
import SceneSig from './scenes/fundation/signatures'
// 全シーンで共通のSceneManagerを使用する．
import { sceneManager } from './const'

function ViewRoot() {

  // 共通のシーンマネージャでシーンを実体化する．
  // ローディングシーンだけ特殊なので別枠でインスタンス化しておく．
  const loadingScene = new LoadingScene(sceneManager)
  instanciateAllScenes(sceneManager)

  // シーンマネージャーがシーンを切り替えれるように設定する．
  const [getScene, setScene] = createSignal<SceneBase>();
  sceneManager.bindSceneChangeCallback(setScene);
 sceneManager.changeSceneTo(SceneSig.record)
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

export default ViewRoot

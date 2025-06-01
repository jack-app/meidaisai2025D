import { SourceCode } from "./problems";

const SourceCodeInstances: SourceCode[] = [
  new SourceCode(
    "sample1",
`// 全シーンで共通のSceneManagerを使用する．

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
  )
]

export default SourceCodeInstances;
import type SceneBase from "./sceneBase";
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
        console.log(`Scene ${previousScene?.sceneSignature} から Scene ${scene.sceneSignature} に遷移しています`);
        if (this.sceneChangeCallback) {
            this.sceneChangeCallback(scene);
        }
        this.currentScene.activate();
        previousScene?.deactivate();
    }

    /// シーンを追加する．SceneBaseから呼ばれる．
    addScene(scene: SceneBase) {
        if (this.scenes.has(scene.sceneSignature)) {
            throw new Error(`Scene ${scene.sceneSignature.toString()} はすでに登録されています．`);
        }
        if (scene.options.initialScene) {
            if (this.currentScene) {
                throw new Error(
`初期シーンはすでに設定されています(Scene ${this.currentScene.sceneSignature.toString()}). 
さらに Scene ${scene.sceneSignature.toString()}を初期シーンにすることはできません．`
                );
            }
            this.updateCurrentScene(scene);
        }
        this.scenes.set(scene.sceneSignature, scene);
        console.log(`Scene ${scene.sceneSignature.toString()} を追加しました`);
    }

    /// 現在のシーンをシーンシグネチャで更新する．
    changeSceneTo(sceneSignature: SceneSig) {
        if (!this.scenes.has(sceneSignature)) {
            throw new Error(`Scene ${sceneSignature} は ${this.scenes} に存在しません.`);
        }
        this.updateCurrentScene(this.scenes.get(sceneSignature)!);
    }
}

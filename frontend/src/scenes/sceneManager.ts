import type SceneBase from "./sceneBase";

export default class SceneManager {
    // シーンの一覧を保管する．
    private readonly scenes: {[name: string]: SceneBase} = {};

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
        console.log(`Changing scene to ${scene.name} from ${previousScene?.name}`);
        if (this.sceneChangeCallback) {
            this.sceneChangeCallback(scene);
        }
        this.currentScene.activate();
        previousScene?.deactivate();
    }

    /// シーンを追加する．SceneBaseから呼ばれる．
    addScene(scene: SceneBase) {
        if (this.scenes[scene.name]) {
            throw new Error(`Scene ${scene.name} はすでに登録されています．`);
        }
        if (scene.options.initialScene) {
            if (this.currentScene) {
                throw new Error(
`初期シーンはすでに設定されています(${this.currentScene.name}). 
さらに${scene.name}を初期シーンにすることはできません．`
                );
            }
            this.updateCurrentScene(scene);
        }
        this.scenes[scene.name] = scene;
    }

    /// 現在のシーンをシーン名で更新する．
    changeSceneTo(sceneName: string) {
        if (!this.scenes[sceneName]) {
            throw new Error(`Scene ${sceneName} does not exist in ${this.scenes}.`);
        }
        this.updateCurrentScene(this.scenes[sceneName]);
    }
}

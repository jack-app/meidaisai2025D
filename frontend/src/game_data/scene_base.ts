import { SourceCode } from "./problems";

export default [
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
"typescript",
),
new SourceCode(
"signatures",
`enum SceneSig {
    loading,
    example,
    explanation,
    game,
    record,
    result,
    selection,
    setting,
    title,
};
export default SceneSig;`,
"typescript",
),
new SourceCode(
"scene_instanciate",
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
)
]
import type SceneManager from "./sceneManager";
import ExampleScene from "../example";

export default function instanciateAllScenes(manager: SceneManager) {
    // ここですべてのシーンをインスタンス化する
    new ExampleScene(manager);
    
}
import type SceneManager from "./sceneManager";
import ExampleScene from "../example";
import ExplanationScene from "../explanation";
import GameScene from "../game";
import LoginScene from "../login";
import RecordScene from "../record";
import SelectionScene from "../selection";
import SettingScene from "../setting";
import ResultScene from "../result";
import TitleScene from "../title";

export default function instanciateAllScenes(manager: SceneManager) {
    // ここですべてのシーンをインスタンス化する
    new ExampleScene(manager);
    new ExplanationScene(manager);
    new GameScene(manager);
    new LoginScene(manager);
    new RecordScene(manager);
    new ResultScene(manager);
    new SelectionScene(manager);
    new SettingScene(manager);
    new TitleScene(manager);
}
import type { JSXElement } from "solid-js";
import SceneBase from "./sceneBase"; 
import type SceneManager from "./sceneManager";
import Align from "../components/Align";
import scenes from "./sceneNames";

export default class LoadingScene extends SceneBase {
    constructor(manager: SceneManager) {
        super(manager, scenes.loading, {initialScene: true});
    }

    makeComponent(): JSXElement {
        return <Align horizontal="center" vertical="center">
            <h1> Loading... </h1>
        </Align>
    }
}
import type { JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase"; 
import type SceneManager from "./fundation/sceneManager";
import Align from "../components/Align";
import SceneSig from "./fundation/signatures";

export default class LoadingScene extends SceneBase {
    constructor(manager: SceneManager) {
        super(manager, SceneSig.loading, {initialScene: true});
    }

    makeComponent(): JSXElement {
        return <Align horizontal="center" vertical="center">
            <h1> Loading... </h1>
        </Align>
    }
}
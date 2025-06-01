import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from "pixi.js";
import SceneSig from "./fundation/signatures";
import { userDataManager } from "../const";

export default class RecordScene extends SceneBase {
    private pixiApp!: PixiApp;
    private bestScore: number = 0;
    private totalType: number = 0;
    private CorrectType: number=0;

  // ✅ データマネージャーを受け取る
  constructor(manager: SceneManager) {
    super(manager, SceneSig.record);
  }

  // pixiAppの初期化をする
  async preload(): Promise<void> {
    console.log(`Preloading ${this.sceneSignature}...`);

    const pixiApp = new PixiApp();
    await pixiApp.init({ backgroundAlpha: 0 });
    this.pixiApp = pixiApp;
  }

  // ✅ シーンの表示前に毎回記録データを読み込む
  async load(): Promise<void> {
    const summary = await userDataManager.getRecordSummary();
    console.log(summary);
    this.bestScore = summary.bestWPM;
    this.totalType = summary.totalTypeByte;
  }

    // ✅ 記録を表示する
    makeComponent(): JSXElement {
        return <>
            <div style={{
            "width": '100%',
            "height": '100%',
            "background-image": 'url("/background.png")',  // ← このように書く
            "background-size": 'cover',
            "background-position": 'center',
            "background-repeat": 'no-repeat',
            "position": 'absolute',
            "top": '0px',
            "left": '0px',
            "z-index": '-1',
        }}>
        </div>
            <p style={{
                "font-weight":'bold',
                "font-size":'12vh',
                "color":'white',
                "position":'absolute',
                "top":'-5vh',
                "left":'10vw', 
            }}>
                <span style="color:#00CA82">1</span>&nbsp;&lt;Record&gt;
            </p>     
            <p style={{
                "font-weight":'bold',
                "font-size":'12vh',
                "color":'white',
                "position":'absolute',
                "top":'11vh',
                "left":'10vw', 
            }}>
                <span style="color:#00CA82">2</span>&nbsp;&nbsp;&nbsp;<span style="color:#1E7FFC">best_score</span> = {this.bestScore} ;
            </p> 
            <p style={{
                "font-weight":'bold',
                "font-size":'12vh',
                "color":'white',
                "position":'absolute',
                "top":'27vh',
                "left":'10vw',
            }}>
                <span style="color:#00CA82">3</span>&nbsp;&nbsp;&nbsp;<span style="color:#1E7FFC">total_type</span> = {this.totalType} ;
            </p>  
            <p style={{
                "font-weight":'bold',
                "font-size":'12vh',
                "color":'white',
                "position":'absolute',
                "top":'43vh',
                "left":'10vw',
            }}>
               <span style="color:#00CA82">4</span>&nbsp;&lt;/Record&gt;
            </p>   
            <button style={{
                "position": 'absolute',
                "top": '78vh',
                "left": '30vw',
                "width": '40vw',
                "height": '15vh',
                "font-size": '11vh',
                "font-weight": 'bold',
                "background-color": '#f8f8ff',
                "color": 'black',
                "border": 'none',
                "border-radius": '1vh',
                "cursor": 'pointer',
                "letter-spacing": '0vh',
                "justify-content": 'center', 
                "display": 'flex',
                "align-items": 'center',
            }}
                onClick={() => {
                    this.manager.changeSceneTo(SceneSig.selection);
                }}
            >
                <span style = "color:#DE4999">return</span>&nbsp;Home;
            </button>
        </>
    }
    

    }

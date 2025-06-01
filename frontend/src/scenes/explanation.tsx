import { type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import SceneSig from "./fundation/signatures";

export default class ExplanationScene extends SceneBase {
   
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.explanation
        );
    }

    //
    // コンポーネントを作成する
    //

    makeComponent(): JSXElement {
        return <div style={
            {
                position: 'relative',
                width: '100%',
                height: '100%',
            }
        }>
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
        <div style={{
            "width": '70%',
            "height":'18%',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'19%',
            "left":'20%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3%',
            "color":'black' //上の四角
            }}>
          表示されるコードをタイピングしましょう。  
        </div>
        <div style={{
            "width":'70%',
            "height":'18%',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'46%',
            "left":'20%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3%',
            "color":'black'  //真ん中の四角
        }}>
            1つのコード当たりの制限時間は秒です。
        </div>
        <div style={{
            "width": '70%',
            "height":'18%',
            "background-color":'#ECEBEE',
            "position":'absolute',
            "top":'73%',
            "left":'20%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center', /* 縦方向中央揃え */
            "padding-left":'3%',
            "color":'black'  //下の四角
        }}>
             コードをタイピングできた数に応じてメーターが上がります。
        </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'17%',
            "left":'5%',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white' //上の丸
        }}>
            ルール
            </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'44%',
            "left":'5%',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white'  //真ん中の丸
        }}>
            時間制限
            </div>
        <div style={{
            "width": '22vh',
            "height": '22vh',
            "background-color":'#4F97FC',
            "position":'absolute',
            "top":'71%',
            "left":'5%',
            "border-radius":'50%',
            "font-size": '5vh',
            "font-weight": 'bold',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "color":'white',  //下の丸
        }}>
            メーター
            </div>
         <div style={{
            "width": '100%',
            "height":'12vh',
            "background-color":'#7C11EA',
            "position":'absolute',
            "top":'0px',
            "left":'0px',
            "font-size": '6vh',
            "font-weight": 'bold',
            "display": 'flex',
            "align-items": 'center',
            "padding-left": '5vw',
            "color":'white',
        }}>
            遊び方
        </div>
       
        <button style={{
            "position":'absolute',
            "top":'1%',
            "left":'85%',
            "width":'13%',
            "height":'9%',
            "font-size":'4vh',
            "font-weight":'bold',
            "background-color":'#f8f8ff',
            "color":'black',
            "border":'none',
            "border-radius":'1vh',
            "cursor":'pointer',
            "letter-spacing":'1vh',
            "justify-content": 'center',
            "display": 'flex',
            "align-items": 'center',
            "padding": '0',
        }}
        onClick={() => {
            this.manager.changeSceneTo(SceneSig.selection);
        }}
    >
        閉じる
    </button>
        </div>
    }
}
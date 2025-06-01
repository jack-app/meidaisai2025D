import { onMount, type JSXElement } from "solid-js";
import SceneBase from "./fundation/sceneBase";
import type SceneManager from "./fundation/sceneManager";
import { Container, Application as PixiApp } from 'pixi.js'
import SceneSig from "./fundation/signatures";
import './setting.module.css'; // スタイルシートのインポート
import { userDataManager } from "../const";
import type { UserSetting } from "../data_interface/user_data/types";

export default class SettingScene extends SceneBase {
    
    //
    // 初期化処理
    //

    constructor(manager: SceneManager) {
        super(
            manager,
            SceneSig.setting
        );
    }

    private setting!: UserSetting;
    private initialized = false;
    private waitingForInitialization: (() => void)[] = [];
    async preload(): Promise<void> {
        console.log(`Preloading ${this.sceneSignature}...`);

        // 各種初期化を並行して行う．
        await Promise.all([
            
            (async () => {
                this.setting = await userDataManager.getUserSetting();
            })(),

        ]);

        this.initialized = true;
        this.waitingForInitialization.forEach(resolve => resolve());
    }

    async load(): Promise<void> {
        this.setting = await userDataManager.getUserSetting();
        
        // シーンの表示前に初期化済みであることを確かめておく
        if (this.initialized) return;
        await new Promise<void>(
            (resolve) => {
                this.waitingForInitialization.push(resolve);
            }
        )
    }

    makeComponent(): JSXElement {
        return <Background>
            <Header onClose={() => this.manager.changeSceneTo(SceneSig.selection)} />
            <Body 
                eventListeners={{
                    timelimit: (checked) => {
                        this.setting.timeLimitPresentation = checked;
                        userDataManager.setUserSetting(this.setting);
                    }
                }}
                initialSetting={this.setting}
            />
        </Background>
    }
}

function Background(props: {children: JSXElement}) {
    return (
        <div style={{
            width: '100%',
            height: '100%',
            "background-image": 'url(/images/background.png)',
            "background-size": 'cover',
            display: 'flex',
            "flex-direction": 'column',
            "justify-content": 'center',
            "align-items": 'center',
            gap: '20px'
        }}>
            {props.children}
        </div>
    );
}

function Header(props: {onClose: () => void}) {
    return <header style={{
        display: 'flex',
        'flex-direction': 'row',
        'flex-basis': '10%',
        "height":'9vh',
        "width": '100%',
        'background-color': 'rgb(124, 17, 234)',
        'align-items': 'center',
    }}>
        <div class='spacer' style={{width:'2%', "flex-grow": '0'}}/>
        <h1
            style={{
                "font-size": '7vh',
                "font-weight": 'bold',
                "color": 'white',
            }}
        >
            設定
        </h1>
        <div class='spacer' style={{"flex-grow": '1'}}/>
        <button onClick={props.onClose} style={
            {
                "width":'13vw',
                "height": '90%',
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
            }
        }>
            閉じる
        </button>
        <div class='spacer' style={{width:'2%', "flex-grow": '0'}}/>
    </header>
}

function Body(props: {
    eventListeners: {
        timelimit?: (checked: boolean) => void,
        bgm?: (checked: boolean) => void,
        sfx?: (checked: boolean) => void,
        typingSound?: (checked: boolean) => void,
    },
    initialSetting: UserSetting
}) {
    return <div class='content-area' style={{
        'flex-basis': '0',
        'flex-grow': '1',
    }}>
        <ul style={{"list-style": 'none'}}>
            <ListEntry 
                onChange={props.eventListeners.timelimit}
                initialState={props.initialSetting.timeLimitPresentation}
            >制限時間</ListEntry>
            {/* <ListEntry>BGM</ListEntry>
            <ListEntry>効果音</ListEntry>
            <ListEntry>タイピング音</ListEntry> */}
        </ul>
    </div>
}

function ListEntry(props: {children: JSXElement, initialState: boolean, onChange?: (checked: boolean) => void}) {
    return <li style={{'font-size': '2em'}}>
        <label>
            <input 
                type="checkbox" 
                onChange={
                    (e) => {props.onChange?.(e.target.checked);}
                }
                style={
                    {
                        width: '1.5em',
                        height: '1.5em',
                    }
                }
                checked={props.initialState}
            />
            {props.children}
        </label>
    </li>;
}
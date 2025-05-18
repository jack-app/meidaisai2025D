
# ディレクトリ構成

- public/: ビルド時にそのまま出力されるファイル群です．ここにアセットを**配置します**．
- src/: フロントエンドの開発では、このディレクトリを**編集します**．
  - components/: viewの生成に用いられるコンポーネント (SolidJS) を配置します．viewのうち汎用的な要素はここに置くものと考えて差し支えありません．
  - scenes/: シーンを配置します．詳しくは[開発手順,シーンの追加](#シーンの追加)を参照してください．
  - data_interface/: 
- node_modules/: 依存ライブラリが格納されます．`npm install`で作成されます．直接編集することはありません．
- package.json: プロジェクトの設定ファイルです．通常編集しません．
- package-lock.json: npmによって自動で生成されるファイルです．直接編集することはありません．
- tsconfig.json, tsconfig.app.json, tsconfig.node.json: TypeScriptの設定ファイルです．普通編集しません．
- vite.config.ts: Viteの設定ファイルです．普通編集しません．

# 開発手順

## シーンの追加

### 1. シーンシグネチャ (識別子) の登録

シーンシグネチャは，シーンを識別するための印．
シグネチャ自体は単なる印であってなんの機能もない．
ただし，シーン遷移の実現のために必要なので，登録しておく．

`src/scenes/fundation/signatures.ts`を編集する．

```ts
enum SceneSig {
    loading,
    example,
};
export default SceneSig;
```

に`xxx`というシーンを追加するなら，

```ts
enum SceneSig {
    loading,
    example,
    xxx, // ここに追加
};
export default SceneSig;
```

とする．

### 2. ファイルの作成

`src/scenes/fundation/template.tsx`を複製して，新しいシーンのソースファイルを`src/scenes/`に作る．
たとえば，`src/scenes/example.tsx`に複製する．

新しいファイルを作ったら，そのファイルの内容を編集してシーンを作る．

### 3. 画面遷移の実現


画面遷移をするときは，`SceneBase`を継承したクラスの`manager`から`changeSceneTo`を呼び出す．

```ts
class XxxScene extends SceneBase {
    ...
    someMethod() {
        ...
        this.manager.changeSceneTo(SceneSig.遷移したいシーン);
        ...
    }
}
```

この際，普通は自身以外のシーンへの遷移を書く．

### 4. シーンの実体化

`src/scenes/fundation/instanciate.ts`を編集してシーンを実体化させる．

```ts
import type SceneManager from "./sceneManager";
import ExampleScene from "../example";

export default function instanciateAllScenes(manager: SceneManager) {
    // ここですべてのシーンをインスタンス化する
    new ExampleScene(manager);
    
}
```

にシーン`xxx`を追加するなら，

```ts
import type SceneManager from "./sceneManager";
import ExampleScene from "../example";
import XxxScene from "../xxx"; // ここでXxxSceneをインポートする

export default function instanciateAllScenes(manager: SceneManager) {
    // ここですべてのシーンをインスタンス化する
    new ExampleScene(manager);
    new XxxScene(manager); // これを追加する
}
```

とする．

# 開発のヒント

## 自動ビルド

作成したコードを動作させるために，**ビルド**が必要です．
(カレントディレクトリを`frontend`にして)
`npm run build`でビルドできますが，変更のたびにこのコマンドを実行するのは面倒です．

そこで，`npm run build:watch`と実行することで，変更を監視し，変更があれば自動でビルドが走るようにできます．
変更の監視を停止するときは，`npm run build:watch`を実行したターミナルで"Ctrl+C"か，バツボタンでターミナルを閉じます．

## 単体テストの配置

`xxx.test.ts`としてテストを配置してください．
ファイル名の末尾は必ず`.test.ts`である必要があります．

## 全テストを実行したいとき

(カレントディレクトリを`frontend`にして)
`npm test`

## 特定のディレクトリ内のテストを実行したいとき

(カレントディレクトリを`frontend`にして)
`npm test <ここにディレクトリのパス>`

例えば，functions/src/scenes内のテストのみ実行したい場合は`npm test scenes`とします．
詳細は`npx vitest --help`で確認することもできます．

## 統合テスト

1. `launch_local_server.sh`を実行してエミュレータを起動します．
2. " http://127.0.0.1:5000 "にアクセスして動作を確認します．

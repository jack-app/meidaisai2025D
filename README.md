# meidaisai2025D
2025年のアイデアソンででたアイディア: タイピングゲームを作るタイピングゲームを作ります．

# 開発環境の用意

## リポジトリの用意

1. `git`をインストールする．(詳細略)
2. `github`に公開鍵を登録する．(詳細略)
3. リポジトリをクローンする．ターミナルを開いて，`git clone git@github.com:jack-app/meidaisai2025D.git`を実行する．
4. 自分の名前のブランチを作る．`git branch <あなたの名前>`
5. 先に作ったブランチに移動する．`git switch <あなたの名前>`

このまま，権限が正しく設定されているか確認します．

6. リモートリポジトリに新しく作ったブランチを反映する．`git push origin <あなたの名前>`

6.で失敗した場合のヒント:
- githubへのssh-keyの登録
- `git config user.name <githubのユーザ名>`および`git config user.email　<githubのメールアドレス>`
- リモートリポジトリ"meidaisai2025D"にあなたが追加されていない．

## 依存関係の解決

1. プロジェクトルートに移動する．
2. カレントディレクトリをfunctionsにする. ターミナルを開いて，`cd functions`
3. 必要なライブラリをインストールする．`npm install`
4. プロジェクトルートに戻る．`cd ..`
5. カレントディレクトリをtest-clientにする．`cd test-client`
6. 必要なライブラリをインストールする．`npm install`

1.について，
- プロジェクトルートとは，`meidaisai2025D/`のことです．
- meidaisai2025DフォルダでVSCodeを開いて統合ターミナルを開くとすでにプロジェクトルートにいる状態からスタートします．
- ファイルエクスプローラでmeidaisai2025Dフォルダをひらいて，”ここで端末を開く”をクリックしてもプロジェクトルートに居る状態でターミナルが起動します．

## firebase-toolの用意

1. `npm`をインストールする．`node.js`をインストールすれば自動でインストールされる．[ここからインストール可能です．](https://nodejs.org/ja)
2. ターミナルをひらいて，`npm i -g firebase-tools`で`firebase`コマンドをインストールする．
3. `firebase --version`で`firebase`コマンドがインストールできたことを確認する．

ここから，`firebase`コマンドが正しくインストールできたかを確認します．

4. カレントディレクトリをfunctionsにする. `cd functions`
5. TS->JS．`npm run build`
6. プロジェクトルートに戻る．`cd ..`
7. firebaseのエミュレータを起動する．`firebase emulators:start`
8. "Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files."と表示されるまで待つ．
9. 別のターミナルを開いて，プロジェクトルートに移動する
10. test-clientをカレントディレクトリにする．`cd test-client`
11. `npm test`を実行する．
12.  "PASS"と表示されることを確認する．（エミュレータが正しく動作していない場合，"FAIL  Tests failed."と言われます．）

以下は起動したテストやエミュレータを終了する手順です

13. テストの終了: テストを実行したターミナルを開きながら_Q_をおす
14. エミュレータの終了: エミュレータを起動したターミナルを開きながら_Ctrl+C_(Macの場合はわからないです．すみません．)

# テスト方法

デプロイ(後述)せずに，自分のプログラムの動作確認をしたい場合，次の手順に従ってください．

1. カレントディレクトリの変更
`meidaisai2025D/functions`にカレントディレクトリを移動してください．
例えば，以下のようにします．
```
cd functions
```

2. ソースコードのクロスコンパイル

以下のコマンドを実行してください．
```
npm run build:watch
```
これによって，TSのソースコードに変更があれば自動でクロスコンパイルが走るようになります．
次のステップでこのウィンドウを閉じないように注意してください．（閉じても特段問題は起きませんが，ホットリロードは効かなくなります．）

3. ローカルサーバの起動

別のターミナルを開いて，プロジェクトルートで以下のコマンドを実行してください．
```
firebase emulators:start
```
しばらく待つと`functions[asia-northeast1-appFunction]: http function initialized (...)`と表示されます．
ここに，" http://localhost:[ポート番号]/metype-ffe25/asia-northeast1/appFunction "のようなURLが表示されます．

このURLをブラウザのアドレスバーに貼り付け (もしくはCTRLを押しながらURLをクリック) で" https://metype-ffe25.web.app/ "に対応するページが表示されます．

ブラウザにキャッシュが残っていて**変更内容が反映されない**ことが往々にしてあります．
その場合，キャッシュクリアを行ってください．
Chromeの場合はキャッシュクリアしたいページを開きながら"Shift+F5"でできます．

参考: https://zenn.dev/nananaoto/articles/9bff8b9eca891656c110

# デプロイ手順

**main**ブランチに**プルリクエスト**を出して，**@えんぴつ にデプロイを依頼**してください．
プルリクエストの出し方がわからない場合は @えんぴつ に連絡してください．

## デプロイとは？
開発者以外が開発したアプリを利用できるようにする作業です．

## デプロイ作業の内容
以下の作業は基本的には @えんぴつ が行いますが，googleアカウントをプロジェクトに登録できれば他の方もデプロイ作業を行えます．
アカウントの追加が必要になった場合は @えんぴつ に連絡してください．

実際のデプロイ手順は次の通りです．

1. firebaseにログインする．`firebase login`
2. デプロイする`firebase deploy`

デプロイが済んだら，" https://metype-ffe25.web.app/ "に変更が反映されます．
ブラウザにキャッシュが残っていて**変更内容が反映されない**ことが往々にしてあります．
その場合，キャッシュクリアを行ってください．
Chromeの場合はキャッシュクリアしたいページを開きながら"Shift+F5"でできます．

# コーディングのヒント

## 動的コンテンツと静的コンテンツ

リクエストによって内容が変わるコンテンツ（リクエストごとに生成するコンテンツ）を**動的コンテンツ**といいます．
一方，どんなリクエストに対しても同じコンテンツ（すでにあるコンテンツ）を**静的コンテンツ**といいます．

動的コンテンツとしては，例えば

- REST API
- ユーザー名によって表示の変わるページ

があります．

静的コンテンツとしては，例えば

- CSS
- クライアントサイドのスクリプト

があります．

## ルーティングの変更

動的コンテンツのルーティング: `functions/src/index.ts`を編集します．
静的コンテンツのルーティング: `public`内のディレクトリ構成を変更します．

仮に静的コンテンツと動的コンテンツで重複するエンドポイント（ルーティング）があった場合，静的コンテンツのほうが優先されるので注意してください．

# バックエンド (functions) の開発におけるヒント

## （RESTful APIの）インタラクティブなテスト

[shellモードを用いる](https://firebase.google.com/docs/functions/local-shell?hl=ja)

## テストの配置

`xxx.test.ts`としてテストを配置してください．
ファイル名の末尾は必ず`.test.ts`である必要があります．

## 全テストを実行したいとき

(カレントディレクトリを`functions`にして)
`npm test`

## 特定のディレクトリ内のテストを実行したいとき

(カレントディレクトリを`functions`にして)
`npm test <ここにディレクトリのパス>`

例えば，functions/src/views内のテストのみ実行したい場合は`npm test views`とします．
詳細は`npx vitest --help`で確認することもできます．

## クライアント（フロントエンド）としてテストしたいとき

`test-client`パッケージを編集してください．
カレントディレクトリを`test-client`にして`npm test`を実行すると，すべてのクライアントサイドテストが走ります．

# 参考

- https://www.youtube.com/watch?v=LOeioOKUKI8
- https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja
- https://firebase.google.com/docs/functions
- https://firebase.google.com/docs/functions/typescript
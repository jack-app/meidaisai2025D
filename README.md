# meidaisai2025D
2025年のアイデアソンででたアイディア: タイピングゲームを作るタイピングゲームを作ります．

- [meidaisai2025D](#meidaisai2025d)
- [プロジェクト概要](#プロジェクト概要)
  - [functions](#functions)
  - [test-client](#test-client)
  - [frontend](#frontend)
  - [public](#public)
- [開発環境の立ち上げ](#開発環境の立ち上げ)
- [開発環境の用意](#開発環境の用意)
  - [リポジトリの用意](#リポジトリの用意)
  - [依存関係の解決](#依存関係の解決)
  - [Javaのインストール](#javaのインストール)
  - [firebase-toolsの用意](#firebase-toolsの用意)
- [デプロイ手順](#デプロイ手順)
  - [デプロイとは？](#デプロイとは)
  - [デプロイ作業の内容](#デプロイ作業の内容)
- [Tips](#tips)
- [参考](#参考)


# プロジェクト概要

本プロジェクトは3つのnpmパッケージ（npmコマンドが使えるディレクトリ）から構成されています．

- `frontend`
- `functions`
- `test-client`

また，npmパッケージ以外に，以下のディレクトリを含みます．

- `public`

前提として，本プロジェクトは**firebase**でホスティング（世界に発信）されます．
`functions`と`public`はfirebaseとつよい関わりがあります．

## functions

`functions`はfirebase-functionsにデプロイされるソースコードを格納するためのnpmパッケージです．
firebase-functionsは，クラウド上でプログラムを実行するサービスです．

開発者はバックエンドの開発のためにこのパッケージのソースコード(`src/**`)を編集します．
このディレクトリに関する詳細は[functions/README.md](functions/README.md)を確認してください．

## test-client

`test-client`は一般公開されることはありません．
開発者は`functions`パッケージで実装した機能をユーザの立場としてテストしたいときにこのパッケージを編集，利用します．

## frontend

`frontend`はユーザの手元で実行するプログラム，およびユーザに直接配信されるコンテンツを格納を格納するためのnpmパッケージです．
ただし，このパッケージ自体が直接ユーザに配信されるわけではなく，**ビルド**を行って，publicに配信するコンテンツ・プログラムを配置します．

開発者はフロントエンドの開発のためにこのパッケージのソースコード(`src/**`)を編集します．
このディレクトリに関する詳細は[frontend/README.md](frontend/README.md)を確認してください．

## public

`public`はfirebase-hostingにデプロイされるソースコードを格納するためのディレクトリです．
`public`と`frontend/public`は別物であることに注意してください．

`public`に配置されたファイルはそのままユーザの手元に届きます．
`public`は`frontend`から自動で生成されるため，開発者がこのディレクトリを直接編集することはありません．

# 開発環境の立ち上げ

以下の手順を必要に応じて実行します．

1. リポジトリを最新にする．`git pull origin main`

2. フロントエンドの自動ビルドを有効化する. `cd frontend && npm run build:watch`
3. バックエンドの自動ビルドを有効化する． `cd functions && npm run build:watch`
4. firebaseのエミュレータを起動する． `firebase emulators:start`

手順2から4は`launch_local_server.sh`にスクリプトとしてまとめてあります．

# 開発環境の用意

すべての手順を位置から順番に実行しなければならないわけではありません．たとえば，すでにリポジトリをクローンしてある場合は新たにクローンする必要はありません．
かわりに，`git pull origin main`を実行してローカルリポジトリ（手元の作業環境）を最新の状態に更新してください．

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

1. `npm`をインストールする(すでにインストールしてある場合は不要)．`node.js`をインストールすれば自動でインストールされる．[ここからインストール可能です．](https://nodejs.org/ja)
2. プロジェクトルートに移動する．
3. カレントディレクトリをfunctionsにする. ターミナルを開いて，`cd functions`
4. 必要なライブラリをインストールする．`npm install`
5. プロジェクトルートに戻る．`cd ..`
6. カレントディレクトリをtest-clientにする．`cd test-client`
7. 必要なライブラリをインストールする．`npm install`

1.について，
- プロジェクトルートとは，`meidaisai2025D/`のことです．
- meidaisai2025DフォルダでVSCodeを開いて統合ターミナルを開くとすでにプロジェクトルートにいる状態からスタートします．
- ファイルエクスプローラでmeidaisai2025Dフォルダをひらいて，”ここで端末を開く”をクリックしてもプロジェクトルートに居る状態でターミナルが起動します．

## Javaのインストール

firebase-toolsを動作させるためにJDK(ver11以上)が必要なため，インストールします．
どのようにインストールしてもよいですが，たとえば[この記事](https://codeforfun.jp/how-to-install-java-jdk-on-windows-and-mac/)を参考にしてください．

## firebase-toolsの用意

1. `npm`をインストールする(すでにインストールしてある場合は不要)．`node.js`をインストールすれば自動でインストールされる．[ここからインストール可能です．](https://nodejs.org/ja)
2. ターミナルをひらいて，`npm i -g firebase-tools`で`firebase`コマンドをインストールする．
3. `firebase --version`で`firebase`コマンドがインストールできたことを確認する．

ここから，`firebase`コマンドが正しくインストールできたかを確認します．

4. カレントディレクトリをfunctionsにする. `cd functions`
5. TS->JS．`npm run build`
6. プロジェクトルートに戻る．`cd ..`
7. firebaseにログインする．`firebase login`
8. firebaseのエミュレータを起動する．`firebase emulators:start`
9. "Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files."と表示されるまで待つ．
10. 別のターミナルを開いて，プロジェクトルートに移動する
11. test-clientをカレントディレクトリにする．`cd test-client`
12. `npm test`を実行する．
13.  "PASS"と表示されることを確認する．（エミュレータが正しく動作していない場合，"FAIL  Tests failed."と言われます．）

以下は起動したテストやエミュレータを終了する手順です．（バツボタンでターミナルを閉じても構いません）

14. テストの終了: テストを実行したターミナルを開きながら"Q"をおす
15. エミュレータの終了: エミュレータを起動したターミナルを開きながら"Ctrl+C"(Macの場合はわからないです．すみません．)

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
2. バックエンドの依存パッケージを最新にする．`cd functions && npm install`
3. バックエンドをビルドする．`npm run build && cd ..`
4. フロントエンドの依存パッケージを最新にする．`cd frontend && npm install`
5. フロントエンドをビルドする．`npm run build && cd ..`
6. デプロイする`firebase deploy`

手順2以降は`deploy.sh`にスクリプトとしてまとめてあります．

デプロイが済んだら，" https://metype-ffe25.web.app/ "に変更が反映されます．
ブラウザにキャッシュが残っていて**変更内容が反映されない**ことが往々にしてあります．
その場合，キャッシュクリアを行ってください．
Chromeの場合はキャッシュクリアしたいページを開きながら"Shift+F5"でできます．

# Tips

- コードを編集したら頻繁に保存してください．"Ctrl+S"で保存できます．
- VSCodeを使用している場合，"Ctrl+J"で統合ターミナル（ターミナルの一種）を開けます．
    - 統合ターミナルの右上のプラスボタンで新しくターミナルを開けます．
- スクリプトはコマンドプロンプトから実行します．たとえば，`launch_local_server.sh`を実行したいときは，カレントディレクトリをプロジェクトルートにして，`./launch_local_server.sh`と入力し実行します．

# 参考

- https://www.youtube.com/watch?v=LOeioOKUKI8
- https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja
- https://firebase.google.com/docs/functions
- https://firebase.google.com/docs/functions/typescript
- https://zenn.dev/nyoroko/articles/f03f4dfa375e05
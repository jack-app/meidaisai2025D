# meidaisai2025D
2025年のアイデアソンででたアイディア: タイピングゲームを作るタイピングゲームを作ります．

# 開発環境の用意

## リポジトリの用意

1. `git`をインストールする．(詳細略)
2. `github`に公開鍵を登録する．(詳細略)
3. リポジトリをクローンする．ターミナルを開いて，`git clone git@github.com:jack-app/meidaisai2025D.git`を実行する．
4. 自分の名前のブランチを作る．`git branch <あなたの名前>`
5. 先に作ったブランチに移動する．`git switch <あなたの名前>`

## firebase-toolの用意

1. `npm`をインストールする．`node.js`をインストールすれば自動でインストールされる．[ここからインストール可能です．](https://nodejs.org/ja)
2. `npm i -g firebase-tools`で`firebase`コマンドをインストールする．
3. `firebase --version`で`firebase`コマンドがインストールできたことを確認する．

# テスト方法

デプロイ(後述)せずに，自分のプログラムの動作確認をしたい場合，`firebase serve`を実行してください．
しばらく待つと`functions[asia-northeast1-appFunction]: http function initialized (...)`と表示されます．
ここに，" http://localhost:[ポート番号]/metype-ffe25/asia-northeast1/appFunction "のようなURLが表示されます．
このURLをブラウザのアドレスバーに貼り付け (もしくはCTRLを押しながらURLをクリック) で" https://metype-ffe25.web.app/ "に対応するページが表示されます．

# デプロイ手順

**main**ブランチに**プルリクエスト**を出して，**えんぴつにデプロイを依頼**してください．
プルリクエストの出し方がわからない場合はえんぴつに直接連絡してください．

> [!note] デプロイしたいものデプロイとは？
> 開発者以外が開発したアプリを利用できるようにする作業です．

---

実際のデプロイ手順は次の通りです．

1. firebaseにログインする．`firebase login`
2. デプロイする`firebase deploy`

デプロイが済んだら，" https://metype-ffe25.web.app/ "に反映されます．
ブラウザにキャッシュが残っていて**変更内容が反映されない**ことが往々にしてあります．
その場合，キャッシュクリアを行ってください．
Chromeの場合はキャッシュクリアしたいページを開きながら"Shift+F5"でできます．

# コーディングのヒント

後で追記します．

# 参考

- https://www.youtube.com/watch?v=LOeioOKUKI8
- https://firebase.google.com/docs/firestore/security/rules-conditions?hl=ja
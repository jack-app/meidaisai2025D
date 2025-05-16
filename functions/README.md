
# バックエンド (functions) の開発におけるヒント

## 自動ビルド

作成したコードを動作させるために，**ビルド**が必要です．
(カレントディレクトリを`functions`にして)
`npm run build`でビルドできますが，変更のたびにこのコマンドを実行するのは面倒です．

そこで，`npm run build:watch`と実行することで，変更を監視し，変更があれば自動でビルドが走るようにできます．
変更の監視を停止するときは，`npm run build:watch`を実行したターミナルで"Ctrl+C"か，バツボタンでターミナルを閉じます．

## ルーティング（エンドポイントの設定）

`functions/src/index.ts`を編集します．

仮に静的コンテンツ（フロントエンド）と動的コンテンツ（バックエンド）で重複するエンドポイント（ルーティング）があった場合，静的コンテンツのほうが優先されるので注意してください．
エンドポイント`/`と`/assets/**`はフロントエンドで使用されています．
他にも，`../frontend/public`に配置されたファイルは`../public`にも配置されるので，そのファイルと同名のエンドポイントを使用することはできません．

## （RESTful APIの）インタラクティブなテスト

[shellモードを用います．](https://firebase.google.com/docs/functions/local-shell?hl=ja)

## 単体テストの配置

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

1. バックエンドのビルド
自動ビルドを有効化していない場合，カレントディレクトリを`functions`として`npm run build`を実行してバックエンドをビルドしてください．

2. テストの配置
`test-client`パッケージを編集してください．

3. フロントエンドのビルド
必要ならフロントエンド（`../frontend`パッケージ）もビルドしてください．
詳しいビルド手順は[frontendのREADME.md](../frontend/README.md)を参照してください

4. ローカルサーバの起動
ターミナルを開いて，プロジェクトルートで以下のコマンドを実行してください．
```
firebase emulators:start
```
しばらく待つと"Issues? Report them at https://github.com/firebase/firebase-tools/issues and attach the *-debug.log files."と表示されたら起動完了です．

5. テストの実行
カレントディレクトリを`test-client`にして`npm test`を実行すると，すべてのクライアントサイドテストが走ります．

参考: https://zenn.dev/nananaoto/articles/9bff8b9eca891656c110


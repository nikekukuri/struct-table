# TODO

* graph
  *  入力フォーム
    * [x] A: ノードの追加
    * [x] エッジの追加(ノードの追加で自動的にエッジを追加したい)
  *  グラフの描画
    * [ ] A: 自動的な見やすい配置(depthをNodeCacheに設定して、同じdepthでは横並び配置)
      * [ ] 深さ方向
      * [ ] 幅方向
    * [ ] A: 複数グラフエリアの表示（比較用）
      * [ ] コンポネント化
    * [ ] B: 伝搬の可視化(これもdepthで管理)
  * 計算
    * [ ] バリデーション
    * [ ] calculate関数のエラー表示(logのテキストエリアを表示)
  * データベースとの同期
    * [ ] B: テーブルへの移動
    * [ ] B: データベースからの取得
    * [ ] B: データベースへの保存

* table
  - [x] テーブルのカラム値の取得と表示
    - [x] client
    - [x] server

  - [ ] 複数テーブルの可視化(プルダウンリストで切り替え)
    - [ ] client

  - [ ] Record同士の比較(プルダウンリストでkey対象切り替え)
    - [ ] client

  - [ ] 星取表からの関連テーブルの紐付けおよび下位テーブルのチェック
    - 関連テーブル紐付け
      - [ ] client
    - 下位テーブルのチェック
      - [ ] client

  - [ ] カラムをチェックボックスでフィルター
    - [ ] client

  - [ ] 値の範囲でフィルター
    - [ ] client
  - [x] 複数テーブルの可視化(タブで切り替え)
    - [x] client

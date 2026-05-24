# Prime Steps to Heaven

Prime Steps to Heaven は、ジャズ、天国への階段、静かな緊張感をモチーフにした素数判定クイズゲームです。4つの数字のうち、ただ1つだけ含まれる素数を選び、正解を重ねながら階段を上がっていきます。

## ゲーム概要

- 4つの数字カードから素数を1つ選ぶ
- 正解数、問題数、連続正解数、スコアを表示
- 正解時はカードが光り、不正解時は揺れる
- 通常の Ascent モードは15問
- 60 Second Challenge は60秒でスコアを伸ばすモード
- リザルト画面で各問題の回答履歴を確認できる
- Prime Table 画面でゲームが参照する素数一覧を確認できる
- PCでは2x2、スマホでも押しやすいレスポンシブUI

## ローカル起動

```sh
make setup
make dev
```

Vite dev server が起動したら、表示されたURLをブラウザで開きます。

個別に実行する場合:

```sh
npm install
npm run dev
```

## Dockerでの起動

```sh
docker compose up --build
```

デフォルトでは `http://localhost:5173` で起動します。

## Makefileコマンド

```sh
make setup    # npm install
make dev      # Vite dev server
make build    # TypeScript check + static build
make preview  # dist preview
make clean    # node_modules と dist を削除
```

## GitHub Pagesへのデプロイ

`.github/workflows/deploy.yml` は main ブランチへの push で GitHub Pages にデプロイします。

使用している主要アクション:

- `actions/checkout`
- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

リポジトリの Settings で Pages の Source を GitHub Actions に設定してください。

Vite の `base` は `VITE_BASE_PATH` で調整できます。workflow では次のようにリポジトリ名から自動設定しています。

```sh
VITE_BASE_PATH=/${{ github.event.repository.name }}/
```

カスタムドメインなどでルート配信する場合は `/` を指定してください。

## GitHub Pagesでのルーティング

このアプリは React Router を使わず、`App.tsx` の state でタイトル、ゲーム、リザルト、Prime Table を切り替えています。GitHub Pages の静的ホスティングで `/primes` のような直リンクが 404 になる問題を避けるためです。

将来的にURL付きのページへ拡張する場合は、GitHub Pagesでは `HashRouter` の利用を検討してください。

## リザルト詳細

ゲーム終了後のリザルト画面では、スコアや正答率に加えて Answer History を表示します。各問題ごとに以下を記録します。

- 問題番号
- ステージ
- 表示された4つの選択肢
- ユーザーが選んだ数字
- 正解・不正解
- 不正解時の正解素数
- 回答にかかった時間

履歴はスマホでも読みやすいカード形式で、正解は緑、不正解は赤のアクセントで表示します。

## 素数一覧表ページ

タイトル画面の `Prime Table` から、`src/data/primes.json` の素数テーブルを閲覧できます。

主な機能:

- 範囲フィルタ: `1-100`, `101-500`, `501-1000`, `1001-10000`
- 範囲内の素数件数と表示件数
- 数字検索
- 指定した数字が素数かどうか確認するミニ判定
- 素数カードのクリックハイライト
- タイトル画面またはゲーム開始への導線

## 素数テーブル

`src/data/primes.json` に 2〜10000 の素数リストを保持しています。アプリ起動時に `Set<number>` へ変換し、通常の判定はテーブル参照を優先します。

関連実装:

- `src/lib/prime.ts`
- `src/lib/primeTable.ts`
- `isPrimeByTable(n: number)`
- `isPrime(n: number)`

ゲーム本編の正解候補、Prime Table 画面、ミニ素数判定はいずれもこのテーブルと `src/lib/prime.ts` の関数を参照します。将来的に範囲を拡張する場合は `primes.json` を差し替えるだけで、既存の問題生成ロジックと一覧表示が新しい上限を扱えます。

## 難易度設計

- Stage 1: 1〜50。偶数や5の倍数も混ぜる
- Stage 2: 1〜100。2と5を正解から外し、少し判別しにくくする
- Stage 3: 1〜300。不正解候補から偶数を除外
- Stage 4: 1〜1000。不正解候補から偶数と5の倍数を除外
- Stage 5: 1〜10000。素数に見えやすい奇数の合成数を中心にする

問題生成は `src/lib/question.ts` に集約しています。

## 今後の拡張案

- ハイスコアのローカル保存
- ステージごとのBPM演出
- 合成数を選んだときに因数分解を表示
- 素数テーブルの上限拡張
- 難易度別の練習モード

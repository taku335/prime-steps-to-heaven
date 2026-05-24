# Prime Steps to Heaven

Prime Steps to Heaven は、ジャズ、天国への階段、静かな緊張感をモチーフにした素数判定クイズゲームです。4つの数字のうち、ただ1つだけ含まれる素数を選び、正解を重ねながら階段を上がっていきます。

## ゲーム概要

- 4つの数字カードから素数を1つ選ぶ
- 正解数、問題数、連続正解数、スコアを表示
- 正解時はカードが光り、不正解時は揺れる
- 通常の Ascent モードは15問
- 60 Second Challenge は60秒でスコアを伸ばすモード
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

## 素数テーブル

`src/data/primes.json` に 2〜10000 の素数リストを保持しています。アプリ起動時に `Set<number>` へ変換し、通常の判定はテーブル参照を優先します。

関連実装:

- `src/lib/prime.ts`
- `isPrimeByTable(n: number)`
- `isPrime(n: number)`

将来的に範囲を拡張する場合は `primes.json` を差し替えるだけで、既存の問題生成ロジックが新しい上限を扱えます。

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

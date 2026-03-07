# テストケースの実行と評価

これは連続したシーケンスであり、途中で止めてはいけない。`/skill-test`や他のテストスキルは使用しない。

結果はスキルディレクトリの兄弟として`<skill-name>-workspace/`に保存する。イテレーションごとに整理し（`iteration-1/`、`iteration-2/`など）、各イテレーション内にテストケースごとのディレクトリを作成する。事前にすべてを作成せず、進めながら作成する。

## ステップ1: 同じターンですべての実行を起動する

各テストケースについて、スキルありとスキルなしの2つのサブエージェントを並列で起動する。すべてを一度に起動する。サブエージェントは独立した（フォーク）コンテキストで実行されるため、メイン会話のトークンを消費しない — これを活用してメインコンテキストをスリムに保つ。

**スキルありの実行:**

```
このタスクを実行してください:
- スキルパス: <path-to-skill>
- タスク: <eval prompt>
- 入力ファイル: <eval files if any, or "none">
- 出力先: <workspace>/iteration-<N>/<eval-name>/with_skill/outputs/
- 保存する出力: <ユーザーが重視するもの — 例: ".docxファイル"、"最終CSV">
```

**ベースライン実行**（同じプロンプト、コンテキストを調整）:
- **新しいスキル**: スキルなし。`without_skill/outputs/`に保存。
- **既存スキルの改善**: まずスナップショット（`cp -r <skill-path> <workspace>/skill-snapshot/`）、ベースラインをスナップショットに向ける。`old_skill/outputs/`に保存。

各テストケースに`eval_metadata.json`を書く（アサーションは今は空でよい）。テストしている内容に基づいた説明的な名前を使用する:

```json
{
  "eval_id": 0,
  "eval_name": "descriptive-name-here",
  "prompt": "ユーザーのタスクプロンプト",
  "assertions": []
}
```

## ステップ2: 実行中にアサーションを草案する

待たずに — この時間を有効に使う。各テストケースの定量的アサーションを草案し、ユーザーに説明する。良いアサーションは客観的に検証可能で、ベンチマークビューアーで一目でわかる明確な名前を持つ。主観的なスキル（文体、デザイン品質）にはアサーションを無理に設ける必要はない — 定性的な人間のレビューの方が優れている。

`eval_metadata.json`と`evals/evals.json`をアサーションで更新する。完全なスキーマは`references/schemas.md`を参照。

また、ユーザーがビューアーで何を見るか説明する。

## ステップ3: 実行完了時にタイミングデータを取得する

各サブエージェントが完了すると、`total_tokens`と`duration_ms`を含む通知が届く。すぐに保存する — これが取得できる唯一の機会:

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3
}
```

実行ディレクトリの`timing.json`に保存する。各通知が届いたらすぐに処理する。

## ステップ4: グレーディング、集計、ビューアーの起動

**各実行をグレードする** — `agents/grader.md`を指すグレーダーサブエージェントを起動する。結果を`grading.json`に保存する。ビューアーはこれらの正確なフィールド名を必要とする:

```json
{"text": "アサーションの説明", "passed": true, "evidence": "パスまたはフェイルした理由"}
```

プログラムによる確認には、スクリプトを書く — より速く、より信頼性が高く、再利用可能。

**集計:**

```bash
python -m scripts.aggregate_benchmark <workspace>/iteration-N --skill-name <name>
```

`benchmark.json`と`benchmark.md`を生成する。順序ではwith_skillをベースラインの前に置く。

**アナリストパス** — `agents/analyzer.md`を読んで集計統計が隠すパターンを浮き彫りにする: 識別しないアサーション（スキルに関係なく常にパス）、高分散eval（不安定な可能性）、時間・トークンのトレードオフ。

**ビューアーを起動する:**

```bash
nohup python <skill-creator-path>/eval-viewer/generate_review.py \
  <workspace>/iteration-N \
  --skill-name "my-skill" \
  --benchmark <workspace>/iteration-N/benchmark.json \
  > /dev/null 2>&1 &
VIEWER_PID=$!
```

イテレーション2以降: `--previous-workspace <workspace>/iteration-<N-1>`を追加する。

**ヘッドレス / Cowork環境:** サーバーを起動する代わりに`--static <output_path>`を使用する。「すべてのレビューを送信」ボタンで`feedback.json`をダウンロードする。

**入力を自分で評価する前にevalビューアーを生成する。** まず人間の前に結果を置く — その後、自分の評価ではなく実際のフィードバックに基づいて改善する。

ユーザーに伝える: 「ブラウザで結果を開きました。'Outputs'タブで各テストケースを確認してフィードバックを残せます；'Benchmark'タブで定量的な比較が見られます。終わったら戻ってきてください。」

### ユーザーが見るもの

**Outputsタブ**: プロンプト、出力ファイル（可能な場合はインラインでレンダリング）、前の出力（イテレーション2以降、折りたたみ）、アサーションのグレード（折りたたみ）、フィードバックテキストボックス、前のフィードバック（イテレーション2以降）。

**Benchmarkタブ**: パス率、タイミング、設定ごとのトークン使用量、eval別の詳細とアナリストのメモ。

ナビゲーション: 前・次ボタンまたは矢印キー。「すべてのレビューを送信」で`feedback.json`に保存。

## ステップ5: フィードバックを読む

```json
{
  "reviews": [
    {"run_id": "eval-0-with_skill", "feedback": "チャートに軸ラベルがない"},
    {"run_id": "eval-1-with_skill", "feedback": ""},
    {"run_id": "eval-2-with_skill", "feedback": "完璧、これが好き"}
  ],
  "status": "complete"
}
```

空のフィードバック = 満足。具体的な不満に改善を集中させる。

完了したらビューアーサーバーを終了する:

```bash
kill $VIEWER_PID 2>/dev/null
```

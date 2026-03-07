# JSONスキーマ

このドキュメントはskill-creatorが使用するJSONスキーマを定義する。

---

## evals.json

スキルのevalを定義する。スキルディレクトリ内の`evals/evals.json`に配置する。

```json
{
  "skill_name": "example-skill",
  "evals": [
    {
      "id": 1,
      "prompt": "ユーザーのサンプルプロンプト",
      "expected_output": "期待される結果の説明",
      "files": ["evals/files/sample1.pdf"],
      "expectations": [
        "出力にXが含まれている",
        "スキルがスクリプトYを使用した"
      ]
    }
  ]
}
```

**フィールド:**
- `skill_name`: スキルのフロントマターと一致する名前
- `evals[].id`: 一意の整数識別子
- `evals[].prompt`: 実行するタスク
- `evals[].expected_output`: 成功の人間が読める説明
- `evals[].files`: 入力ファイルパスのオプションリスト（スキルルートからの相対パス）
- `evals[].expectations`: 検証可能な陳述のリスト

---

## history.json

Improveモードでのバージョン進行を追跡する。ワークスペースルートに配置する。

```json
{
  "started_at": "2026-01-15T10:30:00Z",
  "skill_name": "pdf",
  "current_best": "v2",
  "iterations": [
    {
      "version": "v0",
      "parent": null,
      "expectation_pass_rate": 0.65,
      "grading_result": "baseline",
      "is_current_best": false
    },
    {
      "version": "v1",
      "parent": "v0",
      "expectation_pass_rate": 0.75,
      "grading_result": "won",
      "is_current_best": false
    },
    {
      "version": "v2",
      "parent": "v1",
      "expectation_pass_rate": 0.85,
      "grading_result": "won",
      "is_current_best": true
    }
  ]
}
```

**フィールド:**
- `started_at`: 改善開始時のISOタイムスタンプ
- `skill_name`: 改善中のスキルの名前
- `current_best`: 最高パフォーマーのバージョン識別子
- `iterations[].version`: バージョン識別子（v0、v1、...）
- `iterations[].parent`: このバージョンの派生元の親バージョン
- `iterations[].expectation_pass_rate`: グレーディングのパス率
- `iterations[].grading_result`: "baseline"、"won"、"lost"、または "tie"
- `iterations[].is_current_best`: これが現在の最良バージョンかどうか

---

## grading.json

グレーダーエージェントの出力。`<run-dir>/grading.json`に配置する。

```json
{
  "expectations": [
    {
      "text": "出力に 'John Smith' という名前が含まれている",
      "passed": true,
      "evidence": "トランスクリプトのステップ3で発見: '抽出された名前: John Smith, Sarah Johnson'"
    },
    {
      "text": "スプレッドシートのセルB10にSUM数式がある",
      "passed": false,
      "evidence": "スプレッドシートは作成されなかった。出力はテキストファイルだった。"
    }
  ],
  "summary": {
    "passed": 2,
    "failed": 1,
    "total": 3,
    "pass_rate": 0.67
  },
  "execution_metrics": {
    "tool_calls": {
      "Read": 5,
      "Write": 2,
      "Bash": 8
    },
    "total_tool_calls": 15,
    "total_steps": 6,
    "errors_encountered": 0,
    "output_chars": 12450,
    "transcript_chars": 3200
  },
  "timing": {
    "executor_duration_seconds": 165.0,
    "grader_duration_seconds": 26.0,
    "total_duration_seconds": 191.0
  },
  "claims": [
    {
      "claim": "フォームには12の記入可能なフィールドがある",
      "type": "factual",
      "verified": true,
      "evidence": "field_info.jsonで12のフィールドを確認"
    }
  ],
  "user_notes_summary": {
    "uncertainties": ["2023年のデータを使用、古い可能性がある"],
    "needs_review": [],
    "workarounds": ["記入不可フィールドにテキストオーバーレイでフォールバック"]
  },
  "eval_feedback": {
    "suggestions": [
      {
        "assertion": "出力に 'John Smith' という名前が含まれている",
        "reason": "名前を言及する幻覚されたドキュメントもパスする"
      }
    ],
    "overall": "アサーションは存在を確認するが正確性は確認しない。"
  }
}
```

**フィールド:**
- `expectations[]`: 証拠付きのグレードされた期待値
- `summary`: 集計パス/フェイル数
- `execution_metrics`: ツール使用量と出力サイズ（エグゼキューターのmetrics.jsonから）
- `timing`: ウォールクロックタイミング（timing.jsonから）
- `claims`: 出力から抽出して検証した主張
- `user_notes_summary`: エグゼキューターがフラグした問題
- `eval_feedback`: （オプション）evalの改善提案、グレーダーが問題を特定した場合のみ存在

---

## metrics.json

エグゼキューターエージェントの出力。`<run-dir>/outputs/metrics.json`に配置する。

```json
{
  "tool_calls": {
    "Read": 5,
    "Write": 2,
    "Bash": 8,
    "Edit": 1,
    "Glob": 2,
    "Grep": 0
  },
  "total_tool_calls": 18,
  "total_steps": 6,
  "files_created": ["filled_form.pdf", "field_values.json"],
  "errors_encountered": 0,
  "output_chars": 12450,
  "transcript_chars": 3200
}
```

**フィールド:**
- `tool_calls`: ツールタイプごとのカウント
- `total_tool_calls`: すべてのツール呼び出しの合計
- `total_steps`: 主要な実行ステップの数
- `files_created`: 作成された出力ファイルのリスト
- `errors_encountered`: 実行中のエラー数
- `output_chars`: 出力ファイルの総文字数
- `transcript_chars`: トランスクリプトの文字数

---

## timing.json

実行のウォールクロックタイミング。`<run-dir>/timing.json`に配置する。

**取得方法:** サブエージェントタスクが完了すると、タスク通知に`total_tokens`と`duration_ms`が含まれる。すぐに保存する — これらは他の場所には保持されず、後から回収できない。

```json
{
  "total_tokens": 84852,
  "duration_ms": 23332,
  "total_duration_seconds": 23.3,
  "executor_start": "2026-01-15T10:30:00Z",
  "executor_end": "2026-01-15T10:32:45Z",
  "executor_duration_seconds": 165.0,
  "grader_start": "2026-01-15T10:32:46Z",
  "grader_end": "2026-01-15T10:33:12Z",
  "grader_duration_seconds": 26.0
}
```

---

## benchmark.json

Benchmarkモードの出力。`benchmarks/<timestamp>/benchmark.json`に配置する。

```json
{
  "metadata": {
    "skill_name": "pdf",
    "skill_path": "/path/to/pdf",
    "executor_model": "claude-sonnet-4-20250514",
    "analyzer_model": "most-capable-model",
    "timestamp": "2026-01-15T10:30:00Z",
    "evals_run": [1, 2, 3],
    "runs_per_configuration": 3
  },

  "runs": [
    {
      "eval_id": 1,
      "eval_name": "Ocean",
      "configuration": "with_skill",
      "run_number": 1,
      "result": {
        "pass_rate": 0.85,
        "passed": 6,
        "failed": 1,
        "total": 7,
        "time_seconds": 42.5,
        "tokens": 3800,
        "tool_calls": 18,
        "errors": 0
      },
      "expectations": [
        {"text": "...", "passed": true, "evidence": "..."}
      ],
      "notes": [
        "2023年のデータを使用、古い可能性がある",
        "記入不可フィールドにテキストオーバーレイでフォールバック"
      ]
    }
  ],

  "run_summary": {
    "with_skill": {
      "pass_rate": {"mean": 0.85, "stddev": 0.05, "min": 0.80, "max": 0.90},
      "time_seconds": {"mean": 45.0, "stddev": 12.0, "min": 32.0, "max": 58.0},
      "tokens": {"mean": 3800, "stddev": 400, "min": 3200, "max": 4100}
    },
    "without_skill": {
      "pass_rate": {"mean": 0.35, "stddev": 0.08, "min": 0.28, "max": 0.45},
      "time_seconds": {"mean": 32.0, "stddev": 8.0, "min": 24.0, "max": 42.0},
      "tokens": {"mean": 2100, "stddev": 300, "min": 1800, "max": 2500}
    },
    "delta": {
      "pass_rate": "+0.50",
      "time_seconds": "+13.0",
      "tokens": "+1700"
    }
  },

  "notes": [
    "アサーション 'Output is a PDF file' が両設定で100%パス — スキルの価値を区別しない可能性",
    "Eval 3が高い分散を示す（50% ± 40%）— 不安定またはモデル依存の可能性",
    "スキルなし実行がテーブル抽出の期待値で一貫して失敗",
    "スキルが平均13秒の実行時間を追加するが、パス率を50%改善する"
  ]
}
```

**フィールド:**
- `metadata`: ベンチマーク実行に関する情報
  - `skill_name`: スキルの名前
  - `timestamp`: ベンチマーク実行時刻
  - `evals_run`: eval名またはIDのリスト
  - `runs_per_configuration`: 設定ごとの実行数（例: 3）
- `runs[]`: 個別の実行結果
  - `eval_id`: 数値のeval識別子
  - `eval_name`: 人間が読める名前（ビューアーのセクションヘッダーとして使用）
  - `configuration`: 必ず`"with_skill"`または`"without_skill"`（ビューアーがこの文字列をグループ化と色分けに使用）
  - `run_number`: 整数の実行番号（1、2、3...）
  - `result`: `pass_rate`、`passed`、`total`、`time_seconds`、`tokens`、`errors`を含むネストされたオブジェクト
- `run_summary`: 設定ごとの統計集計
  - `with_skill` / `without_skill`: それぞれ`mean`と`stddev`フィールドを含む`pass_rate`、`time_seconds`、`tokens`オブジェクト
  - `delta`: `"+0.50"`、`"+13.0"`、`"+1700"`のような差分文字列
- `notes`: アナライザーからの自由形式の観察

**重要:** ビューアーはこれらのフィールド名を正確に読む。`configuration`の代わりに`config`を使用したり、`pass_rate`を`result`の下にネストする代わりにrunのトップレベルに置いたりすると、ビューアーが空・ゼロの値を表示する原因になる。手動でbenchmark.jsonを生成する際は常にこのスキーマを参照する。

---

## comparison.json

ブラインドコンパレーターの出力。`<grading-dir>/comparison-N.json`に配置する。

```json
{
  "winner": "A",
  "reasoning": "出力Aは適切なフォーマットとすべての必須フィールドを含む完全なソリューションを提供する。出力Bはdateフィールドが欠落しており、フォーマットの一貫性に問題がある。",
  "rubric": {
    "A": {
      "content": {
        "correctness": 5,
        "completeness": 5,
        "accuracy": 4
      },
      "structure": {
        "organization": 4,
        "formatting": 5,
        "usability": 4
      },
      "content_score": 4.7,
      "structure_score": 4.3,
      "overall_score": 9.0
    },
    "B": {
      "content": {
        "correctness": 3,
        "completeness": 2,
        "accuracy": 3
      },
      "structure": {
        "organization": 3,
        "formatting": 2,
        "usability": 3
      },
      "content_score": 2.7,
      "structure_score": 2.7,
      "overall_score": 5.4
    }
  },
  "output_quality": {
    "A": {
      "score": 9,
      "strengths": ["完全なソリューション", "適切なフォーマット", "すべてのフィールドが存在"],
      "weaknesses": ["ヘッダーのスタイルに軽微な不一致"]
    },
    "B": {
      "score": 5,
      "strengths": ["読みやすい出力", "基本構造が正確"],
      "weaknesses": ["dateフィールドが欠落", "フォーマットの不一致", "データ抽出が部分的"]
    }
  },
  "expectation_results": {
    "A": {
      "passed": 4,
      "total": 5,
      "pass_rate": 0.80,
      "details": [
        {"text": "Output includes name", "passed": true}
      ]
    },
    "B": {
      "passed": 3,
      "total": 5,
      "pass_rate": 0.60,
      "details": [
        {"text": "Output includes name", "passed": true}
      ]
    }
  }
}
```

---

## analysis.json

ポストホック分析エージェントの出力。`<grading-dir>/analysis.json`に配置する。

```json
{
  "comparison_summary": {
    "winner": "A",
    "winner_skill": "path/to/winner/skill",
    "loser_skill": "path/to/loser/skill",
    "comparator_reasoning": "コンパレーターが勝者を選んだ理由の概要"
  },
  "winner_strengths": [
    "複数ページドキュメント処理のための明確なステップバイステップの指示",
    "フォーマットエラーを検出した検証スクリプトを含む"
  ],
  "loser_weaknesses": [
    "「適切にドキュメントを処理する」という曖昧な指示が一貫性のない動作につながった",
    "検証スクリプトがなく、エージェントが即興した"
  ],
  "instruction_following": {
    "winner": {
      "score": 9,
      "issues": ["軽微: オプションのログ記録ステップをスキップした"]
    },
    "loser": {
      "score": 6,
      "issues": [
        "スキルのフォーマットテンプレートを使用しなかった",
        "ステップ3を無視して独自のアプローチを考案した"
      ]
    }
  },
  "improvement_suggestions": [
    {
      "priority": "high",
      "category": "instructions",
      "suggestion": "「適切にドキュメントを処理する」を明示的なステップに置き換える",
      "expected_impact": "一貫性のない動作を引き起こした曖昧さを排除できる"
    }
  ],
  "transcript_insights": {
    "winner_execution_pattern": "スキル読み込み -> 5ステップのプロセスに従う -> 検証スクリプト使用",
    "loser_execution_pattern": "スキル読み込み -> アプローチが不明確 -> 3つの異なる方法を試行"
  }
}
```

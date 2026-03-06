# コミットメッセージの提案

スキル（`git-flow/SKILL.md`）のステップ4に基づき、以下のコミットメッセージを推奨します。

## 推奨コミットメッセージ

```
feat(scoring): add critical rate substat support
```

## 根拠

スキルのコミットメッセージ規約（ステップ4）:

- **フォーマット**: `<type>(<scope>): <description>`
- **type**: `feat` — 新しいサブステータスのサポート追加は新機能に該当
- **scope**: `scoring` — スコア計算ロジックへの変更のため
- **description**: 英語・命令形・小文字・末尾ピリオドなし・72文字以内

## 補足

- `feat` を選択した理由: 既存ロジックへのバグ修正ではなく、会心率サブステータスという新しいデータ種別のサポート追加であるため
- `scoring` スコープはスキル内の例示スコープに明示されており、スコア計算ロジックの変更に最適
- スキル内の例 `feat(scoring): add critical damage rate substat support` とほぼ同じケースであり、そのまま参照できます

---
name: review-to-issues
description: 'コードレビュー・監査レポートの発見事項からGitHub Issueを自動生成するスキル。「レビュー結果からIssueを作成して」「発見事項をIssueに起こして」「修正タスクをIssueにして」などの依頼に必ず使用する。/review-to-issues を実行するとIssue生成が即座に開始される。security-audit・dry-check・spec-sync・coverage-report の実行後にも使用する。'
---

# Review to Issues スキル

コードレビュー・監査スキル（security-audit / dry-check / spec-sync / coverage-report）の出力結果を解析し、GitHub Issue を自動生成します。大量の発見事項を管理可能なタスクに分解し、開発チームが即座に着手できる状態にします。

## 前提

- GitHub CLI (`gh`) が認証済みであること
- レビュー結果のテキストが会話内に存在すること（または引数として提供されること）

## 実行フロー

---

## フェーズ 1: 発見事項の解析・分類

以下をメインエージェントで実行する（Agent ツール不要）。

1. 会話履歴からレビュー結果を取得する
   - `/security-audit` の出力: Security Audit レポート
   - `/dry-check` の出力: DRY Check レポート
   - `/spec-sync` の出力: Spec Sync レポート
   - `/coverage-report` の出力: カバレッジレポート
   - または、ユーザーが貼り付けたテキスト

2. 発見事項を以下の基準で分類する:

   **即時対応** (🔴 Critical / High):
   - セキュリティ上の Critical・High 問題
   - テスト失敗・ビルド失敗の原因
   - 仕様との重大な乖離

   **通常対応** (🟡 Medium):
   - セキュリティの Medium 問題
   - DRY 違反（2〜3箇所の重複）
   - テスト未カバーのビジネスロジック

   **バックログ** (🟢 Low):
   - セキュリティの Low 問題
   - 軽微なDRY違反
   - テスト未カバーのユーティリティ関数

3. 各発見事項を1つの Issue に対応付ける
   - 同一カテゴリ・同一ファイルの複数の軽微な問題は1つの Issue にまとめる
   - Critical・High の問題は個別 Issue を作成する

---

## フェーズ 2: Issue 生成

以下のルールで `gh issue create` を実行する。

### Issue タイトルの形式

レビュー種別に応じたプレフィックスを付与:
- security-audit 由来: `セキュリティ: <問題の概要>`
- dry-check 由来: `DRY違反: <重複内容の概要>`
- spec-sync 由来: `仕様乖離: <乖離内容の概要>`
- coverage-report 由来: `test: <対象関数名> のユニットテストを追加する`

### Issue 本文のテンプレート

```
## 概要

<発見事項の詳細説明（1〜3文）>

## 発見箇所

| ファイル | 行番号 | 内容 |
|---------|-------|------|
| <path> | <line> | <description> |

## 重要度

<🔴 Critical / 🟠 High / 🟡 Medium / 🟢 Low>

## 推奨対応

<具体的な修正方針>

## 関連

- 発見スキル: `/<skill-name>`
- 関連Issue: #<number>（あれば）
```

### gh コマンドの実行

```bash
gh issue create \
  --title "<タイトル>" \
  --body "<本文>" \
  --label "<ラベル>"
```

ラベルの対応（存在しない場合はラベルなしで作成）:
- 🔴 Critical / 🟠 High → `bug`
- DRY違反 → ラベルなし
- セキュリティ全般 → `bug`
- テスト追加 → ラベルなし

### 実行ルール

- 一度に最大10件まで Issue を作成する（それ以上は優先度順に選択）
- 各 Issue 作成後に作成された URL を記録する
- エラーが発生した場合はスキップして次の Issue を作成する

---

## フェーズ 3: 作成結果のサマリー出力

全 Issue 作成後、以下の形式でサマリーを出力する。

```
## Issue 作成完了

| 優先度 | タイトル | URL |
|--------|---------|-----|
| 🔴 | <title> | <url> |
| 🟡 | <title> | <url> |
| 🟢 | <title> | <url> |

作成件数: N件
スキップ件数: N件（理由: ...）
```

---

## 注意事項

- 同一問題を重複して Issue 作成しないこと（既存 Issue を `gh issue list` で確認してから作成）
- Issue の本文には具体的な修正方針を含めること（「修正する」だけでは不十分）
- ユーザーが確認のうえ作成を承認した場合のみ Issue を生成すること

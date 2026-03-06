---
name: typescript-expert
description: 'TypeScript の型レベルプログラミング・パフォーマンス最適化・型安全性向上を行うスキル。TypeScript に関する問題や改善依頼時に使用する。'
---

# TypeScript Expert スキル

TypeScript 5 の高度な型システムを活用してコードの型安全性と品質を向上させます。

## 実行手順

### 1. TypeScript 設定の動的読み込み

作業開始前に `webapp/tsconfig.json` を読み取り、現在の設定を確認する:

```bash
cat webapp/tsconfig.json
```

`strict`・`noUncheckedIndexedAccess`・`exactOptionalPropertyTypes` の有効化状況を把握してから作業に入る。

### 2. 型分析（context:fork）

型の問題が広範囲に及ぶ場合は、メインコンテキストを汚染しないよう `context:fork` でサブエージェントに委譲する:

```
<use_agent context="fork">
webapp/src/ 以下の TypeScript ファイルを分析し、以下の型問題を検出・報告する:
1. `any` の使用箇所（ファイル名・行番号付き）
2. 不適切な型アサーション (`as`) の使用
3. 型ガードが必要だが実装されていない箇所
4. `noUncheckedIndexedAccess` 非対応の配列アクセス
5. 戻り値の型注釈が欠如している関数
</use_agent>
```

### 3. 型安全性の修正

分析結果をもとに修正を適用する。`webapp/src/lib/` の既存実装を参照してプロジェクト固有の型定義と整合させる。

## 型安全性の原則

| 問題 | 解決策 |
|------|--------|
| `any` の使用 | `unknown` または適切な型定義に置き換える |
| 状態の型表現 | 判別可能なユニオン型 (`status: 'success' \| 'error'`) を使用する |
| 型の絞り込み | カスタム型ガード (`value is T`) を実装する |
| リテラル型の維持 | `as const` でリテラル型を固定する |
| 型チェックと推論の両立 | `satisfies` 演算子を使用する |
| 既存型からの派生 | `Pick`・`Partial`・`Readonly` などの Utility Types を活用する |

## チェックリスト

- [ ] `any` を使用していないか
- [ ] 全ての関数に戻り値の型注釈があるか（推論できない場合）
- [ ] ユニオン型に型ガードが適切に実装されているか
- [ ] `as` によるキャストを最小限にしているか
- [ ] `noUncheckedIndexedAccess` に対応しているか（配列アクセスの安全性）
- [ ] 型コメントは英語で記述されているか

## 型エラーの確認

```bash
cd webapp && npm run typecheck
```

型エラーが出た場合:
1. エラーメッセージを読む
2. 型定義を確認する
3. `any` で誤魔化さず、正しい型を定義する

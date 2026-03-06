---
name: tdd-workflow
description: 'RED-GREEN-REFACTOR サイクルによる TDD ワークフロースキル。新ロジック追加時に /tdd-workflow を実行してテスト先行開発を行う。'
---

# TDD ワークフロースキル

RED → GREEN → REFACTOR の TDD サイクルで開発を進めます。

**CLAUDE.md の方針:** `TDD 必須 — 新ロジック追加時は先にテストを書く`

## テスト配置規則

```
webapp/src/lib/__tests__/<対象ファイル名>.test.ts
```

## RED フェーズ: 失敗するテストを書く

### ステップ 1: 要件をテストで表現する

```typescript
// webapp/src/lib/__tests__/newFeature.test.ts
import { describe, it, expect } from 'vitest'
import { newFunction } from '../newFeature'

describe('newFunction', () => {
  it('期待する動作を説明する', () => {
    // Arrange
    const input = { /* テスト入力 */ }
    const expected = { /* 期待する出力 */ }

    // Act
    const result = newFunction(input)

    // Assert
    expect(result).toEqual(expected)
  })

  it('エッジケース: 空入力の処理', () => {
    expect(newFunction({})).toEqual(/* 期待値 */)
  })
})
```

### ステップ 2: テストを実行して RED を確認する

```bash
cd webapp && npm test -- --run <test-file-name>
```

テストが失敗することを確認（まだ実装がないため）。

## GREEN フェーズ: テストを通す最小実装

### ステップ 3: 最小限の実装を書く

```typescript
// webapp/src/lib/newFeature.ts
export function newFunction(input: InputType): OutputType {
  // テストを通す最小限の実装
}
```

### ステップ 4: テストをパスさせる

```bash
cd webapp && npm test -- --run <test-file-name>
```

全テストが GREEN になることを確認。

## REFACTOR フェーズ: コードを改善する

### ステップ 5: 品質を高める

リファクタリング時の注意:
- テストは変更しない
- 動作を変えずにコードを改善する
- 重複を排除する
- 命名を明確にする

### ステップ 6: 全テストが通ることを確認

```bash
cd webapp && npm test
```

## このプロジェクトのテストパターン

### スコア計算テスト

```typescript
// スコア計算関数のテストパターン
import { calculateScore } from '../scoring'
import type { Artifact } from '../types'

describe('calculateScore', () => {
  const mockArtifact: Artifact = {
    // テスト用聖遺物データ
  }

  it('会心率サブステのスコアを正しく計算する', () => {
    const result = calculateScore(mockArtifact, weights)
    expect(result).toBeCloseTo(expected, 2)
  })
})
```

## 品質ゲート（全フェーズ共通）

```bash
cd webapp && npm run lint -- --fix && npm run typecheck && npm test
```

## TDD の利点

- バグを早期発見できる
- リファクタリングへの自信が増す
- 設計が自然に改善される
- ドキュメントとしての役割を果たす

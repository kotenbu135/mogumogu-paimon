---
name: typescript-expert
description: 'TypeScript の型レベルプログラミング・パフォーマンス最適化・型安全性向上を行うスキル。TypeScript に関する問題や改善依頼時に使用する。'
---

# TypeScript Expert スキル

TypeScript 5 の高度な型システムを活用してコードの型安全性と品質を向上させます。

## 参照設定

- `webapp/tsconfig.json` — TypeScript 設定
- `webapp/src/lib/` — 型定義・ロジック

## 型安全性の原則

### `any` の禁止

```typescript
// ❌ Bad
function process(data: any) { ... }

// ✅ Good
function process(data: ArtifactData) { ... }

// ✅ Unknown を使用（型チェック強制）
function processUnknown(data: unknown) {
  if (isArtifactData(data)) { ... }
}
```

### 厳格な設定

```json
// tsconfig.json の推奨設定
{
  "compilerOptions": {
    "strict": true,           // 全厳格オプションを有効化
    "noUncheckedIndexedAccess": true,  // 配列アクセスを安全に
    "exactOptionalPropertyTypes": true  // optional の厳格化
  }
}
```

## 型定義パターン

### ユニオン型による状態表現

```typescript
// ✅ 判別可能なユニオン型
type ArtifactRank = 'SS' | 'S' | 'A' | 'B' | 'C'

type ScoreResult =
  | { status: 'success'; score: number; rank: ArtifactRank }
  | { status: 'error'; message: string }
```

### ジェネリクスの活用

```typescript
// ✅ 型安全なフィルタ関数
function filterArtifacts<T extends Artifact>(
  artifacts: T[],
  predicate: (artifact: T) => boolean
): T[] {
  return artifacts.filter(predicate)
}
```

### Mapped Types と Utility Types

```typescript
// ✅ 既存型からの派生
type ArtifactSummary = Pick<Artifact, 'id' | 'setKey' | 'slotKey'>
type PartialArtifact = Partial<Artifact>
type ReadonlyArtifact = Readonly<Artifact>

// ✅ カスタム Mapped Type
type StatWeights = {
  [K in SubstatKey]: number
}
```

## 型推論の最大活用

```typescript
// ✅ as const でリテラル型を維持
const SLOT_KEYS = ['flower', 'plume', 'sands', 'goblet', 'circlet'] as const
type SlotKey = typeof SLOT_KEYS[number]  // 'flower' | 'plume' | ...

// ✅ satisfies で型チェックしながら推論を維持
const weights = {
  critRate: 2.0,
  critDMG: 1.0,
} satisfies Record<string, number>
```

## 型ガードの実装

```typescript
// ✅ カスタム型ガード
function isArtifact(value: unknown): value is Artifact {
  return (
    typeof value === 'object' &&
    value !== null &&
    'setKey' in value &&
    'slotKey' in value
  )
}
```

## チェックリスト

- [ ] `any` を使用していないか
- [ ] 全ての関数に戻り値の型注釈があるか（推論できない場合）
- [ ] ユニオン型に型ガードが適切に実装されているか
- [ ] `as` によるキャストを最小限にしているか
- [ ] `noUncheckedIndexedAccess` に対応しているか（配列アクセスの安全性）
- [ ] 型コメントは英語で記述されているか

## 型エラーのデバッグ

```bash
cd webapp && npm run typecheck
```

型エラーが出た場合:
1. エラーメッセージを読む
2. 型定義を確認する
3. `any` で誤魔化さず、正しい型を定義する

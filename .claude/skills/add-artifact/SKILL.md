# Skill: add-artifact

目的: 新しい聖遺物セットをプロジェクトに追加する作業手順を自動化・標準化します。

前提（作業開始前に必ずユーザーへヒアリング）:
- 追加する `setKey`（camelCase）を列挙してください（例: CelestialGift）
- 各 `setKey` に対する日本語表示名（例: 天からの贈り物）を教えてください
- 各 `setKey` に対する英語表示名（例: Celestial Gift）を教えてください
- 各セットをどのグループに割り当てるか選択してください（選択肢: `サポート用`, `サブアタッカー用`, `メインアタッカー用(v4以降)`, `メインアタッカー用（v3以前）`, `その他`）
- 画像のソース（raw URL のパターン）を指定してください。

自動で実施する変更箇所（スキル実行時）:
- `webapp/src/lib/constants.ts`
  - `ARTIFACT_SET_NAMES` に日本語名を追加
  - `ARTIFACT_SET_GROUPS` の該当グループへ `setKey` を挿入
- `webapp/src/lib/i18n/en.ts`
  - `artifactSetNames` に英語名を追加
- `docs/spec/artifact.md`（ユーザー指定時）
  - `ArtifactSetKey 完全リスト` に `setKey` を追記
- 画像の追加（ユーザー指定時）
  - `webapp/public/artifacts/[SetKey]/` に `flower.png/plume.png/sands.png/goblet.png/circlet.png` を配置（PNG で管理）
  - ※プロジェクトは PNG をそのまま管理します。WebP は任意で `node scripts/convert-webp.mjs` にて生成可能。
- ドキュメント（`docs/spec/artifact.md`）へ追記する

手順（スキルがユーザーに尋ねるプロンプト例）:
1. 追加する聖遺物をカンマ区切りで入力してください（例: CelestialGift,DisenchantmentInDeepShadow）
2. 各セットの日本語表示名を `setKey:日本語名` の形式で入力してください（例: CelestialGift:天からの贈り物）
3. 各セットの英語表示名を `setKey:English Name` の形式で入力してください
4. 各セットのグループを `setKey:グループ名` の形式で入力してください
5. 画像の raw URL パターンを指定してください（例: https://raw.githubusercontent.com/frzyc/genshin-optimizer/master/libs/gi/assets/src/gen/artifacts/CelestialGift/UI_RelicIcon_15045_1.png）

注意事項:
- `setKey` は既存のキーと重複しない camelCase を使用してください。
- `en.ts` の翻訳整合性テスト（`webapp/src/lib/__tests__/i18n.test.ts`）は `en.artifactSetNames` が `ARTIFACT_SET_NAMES` のすべてのキーをカバーしていることを要求します。スキルは自動で `en.ts` を更新しますが、追加後にテスト実行を推奨します。
- 画像を追加する場合、プロジェクト方針により PNG をそのまま管理します（コミットに含める）。

問い合わせ例（スキル実行時のプロンプト）:
```
追加する聖遺物の setKey をカンマ区切りで入力してください:
> CelestialGift,DisenchantmentInDeepShadow

日本語表示名を `setKey:日本語名` で入力してください:
> CelestialGift:天からの贈り物,DisenchantmentInDeepShadow:影に沈む幻

英語表示名を `setKey:英語名` で入力してください:
> CelestialGift:Celestial Gift,DisenchantmentInDeepShadow:Disenchantment in Deep Shadow

グループを `setKey:グループ名` で入力してください:
> CelestialGift:サポート用,DisenchantmentInDeepShadow:メインアタッカー用(v4以降)

画像の raw URL パターンを指定してください:
> https://raw.githubusercontent.com/frzyc/genshin-optimizer/master/libs/gi/assets/src/gen/artifacts/CelestialGift/UI_RelicIcon_15045_1.png
```

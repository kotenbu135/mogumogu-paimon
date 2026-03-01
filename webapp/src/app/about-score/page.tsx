import { SCORE_TYPE_FORMULAS } from '@/lib/constants'
import type { ScoreTypeName } from '@/lib/types'

const SCORE_TYPE_OPTIONS: ScoreTypeName[] = [
  'CV', 'HP型', '攻撃型', '防御型', '熟知型', 'チャージ型', '最良型',
]

export default function AboutScorePage() {
  return (
    <div className="page-container">
      <h1 className="page-title">スコアについて</h1>

      <section className="content-section">
        <h2 className="section-title">スコアとは</h2>
        <p className="content-text">
          スコアは聖遺物のサブステータスの強さを数値で表したものです。
        </p>
        <p className="content-text">
          会心率・会心ダメージを基本とし、キャラクターのビルドに合わせて加算するステータスを選べます。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">CVスコア（会心スコア）</h2>
        <p className="content-text">
          CVスコア（Crit Value）は、聖遺物の評価によく使われる基本的な指標です。
        </p>
        <div className="formula-block">
          <span className="formula-text">CV = 会心率 × 2 + 会心ダメージ</span>
        </div>
        <p className="content-text">
          一般的に、CVスコアが高いほど会心ステータスが優れた聖遺物と言えます。
        </p>
        <div className="score-tier-list">
          <div className="score-tier score-tier-red">55以上 — 非常に優秀</div>
          <div className="score-tier score-tier-orange">45〜54 — 優秀</div>
          <div className="score-tier score-tier-yellow">35〜44 — 良好</div>
          <div className="score-tier score-tier-default">35未満 — 普通</div>
        </div>
      </section>

      <section className="content-section">
        <h2 className="section-title">スコア計算方式一覧</h2>
        <p className="content-text">
          各ビルドに特化したスコアタイプから選んで評価できます。
        </p>
        <ul className="score-formulas-list about-formulas">
          {SCORE_TYPE_OPTIONS.map((type) => (
            <li key={type} className="score-formulas-item about-formulas-item">
              <span className="score-formulas-label">{SCORE_TYPE_FORMULAS[type].label}</span>
              <span className="score-formulas-eq">=</span>
              <span className="score-formulas-formula">{SCORE_TYPE_FORMULAS[type].formula}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default function AboutReconstructionPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">再構築について</h1>

      <section className="content-section">
        <h2 className="section-title">再構築とは</h2>
        <p className="content-text">
          再構築は、聖遺物のサブステータスの強化ロールをやり直す機能です。
          メインステータス・セット・部位はそのままに、サブステータスの強化結果だけがリセットされます。
        </p>
        <p className="content-text">
          再構築時には2つのサブステータスを選択でき、選んだサブステに一定回数以上のロールが保証されます。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">再構築の種類</h2>
        <p className="content-text">
          再構築には3つの種類があり、選択した2つのサブステータスへの保証ロール数が異なります。
        </p>
        <ul className="content-list">
          <li>
            <strong>通常再構築</strong> — 選択した2つのサブステに合計2ロール以上を保証
          </li>
          <li>
            <strong>上級再構築</strong> — 選択した2つのサブステに合計3ロール以上を保証
          </li>
          <li>
            <strong>絶対再構築</strong> — 選択した2つのサブステに合計4ロール以上を保証
          </li>
        </ul>
        <p className="content-text">
          保証ロール数が多いほど、狙ったサブステに強化が集中しやすくなります。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">成功率の計算方法</h2>
        <p className="content-text">
          本サイトでは、再構築でスコアが向上する確率を多項分布に基づいて算出しています。
          計算手順は以下のとおりです。
        </p>
        <ol className="content-list">
          <li>強化N回を4つのサブステに振り分ける全パターンを列挙</li>
          <li>保証条件（選択2サブステへの合計ロール数 ≧ 閾値）を満たすパターンのみを抽出</li>
          <li>各パターンの再構築後スコアを期待値ベースで算出</li>
          <li>現在のスコアを上回るパターンの確率を合計し、成功率として表示</li>
        </ol>
        <p className="content-text">
          各パターンの確率は多項分布（各サブステに均等な確率 1/4 で振り分け）で計算しています。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">保証サブステの選択</h2>
        <p className="content-text">
          成功率の計算では、スコアタイプに応じて最適な保証サブステのペアを自動で選択しています。
        </p>
        <ul className="content-list">
          <li>
            <strong>基本</strong> — 会心率 + 会心ダメージの2つを保証サブステとして選択
          </li>
          <li>
            <strong>理の冠（メインが会心系）</strong> — メインステと同じサブステは出現しないため、残りの会心ステとスコアタイプ固有ステ（例: HP型なら会心ダメージ + HP%）のペアを使用
          </li>
          <li>
            <strong>CV型で理の冠の場合</strong> — 会心系以外の固有ステがないため、成功率は計算できません
          </li>
        </ul>
      </section>

      <section className="content-section">
        <h2 className="section-title">精度に関する注意事項</h2>
        <p className="content-text">
          表示される成功率は近似値であり、実際の結果とは異なる場合があります。
          これは以下の理由によるものです。
        </p>
        <ul className="content-list">
          <li>
            GOODファイルには強化前の初期サブステータス値が含まれていないため、
            初期値は「現在値 − 平均強化幅 × 推定ロール数」で推定しています
          </li>
          <li>
            各サブステの強化ロール数自体も、現在の値から逆算した推定値です
          </li>
          <li>
            強化1回あたりのサブステ上昇値は4段階（低・中・高・最高）のいずれかですが、
            計算では平均値を使用しています
          </li>
        </ul>
        <p className="content-text">
          これらの制約により、成功率はあくまで参考値としてご利用ください。
        </p>
      </section>
    </div>
  )
}

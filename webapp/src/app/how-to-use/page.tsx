export default function HowToUsePage() {
  return (
    <div className="page-container">
      <h1 className="page-title">使い方</h1>

      <section className="content-section">
        <h2 className="section-title">1. GOODファイルを取得する</h2>
        <p className="content-text">
          <a
            href="https://konkers.github.io/irminsul/02-quickstart.html"
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            irminsul
          </a>
          を利用してゲームから聖遺物データをエクスポートします。
          irminsulはGOOD（Genshin Open Object Description）形式のJSONファイルを
          生成するツールです。
        </p>
        <ol className="content-list">
          <li>irminsulをダウンロード・インストールする</li>
          <li>原神を起動した状態でirminsulを実行する</li>
          <li>エクスポートされたJSONファイルを保存する</li>
        </ol>
      </section>

      <section className="content-section">
        <h2 className="section-title">2. GOODファイルを読み込む</h2>
        <p className="content-text">
          ホーム画面のドラッグ&ドロップエリアにGOODファイルをドロップするか、
          クリックしてファイルを選択します。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">3. 聖遺物を確認する</h2>
        <p className="content-text">
          ファイルを読み込むと★5聖遺物が一覧表示されます。
          各カードにはスコアとサブステータスの詳細が表示されます。
        </p>
      </section>

      <section className="content-section">
        <h2 className="section-title">4. フィルタリング・スコアタイプの変更</h2>
        <ul className="content-list">
          <li>
            <strong>スコアタイプ</strong>：
            CV・HP型・攻撃型・防御型・熟知型・チャージ型・最良型から選択できます
          </li>
          <li>
            <strong>セットフィルタ</strong>：
            特定の聖遺物セットのみ表示できます
          </li>
          <li>
            <strong>部位フィルタ</strong>：
            花・羽・砂・杯・冠のいずれかに絞り込めます
          </li>
        </ul>
      </section>

      <section className="content-section">
        <h2 className="section-title">5. アイコンクリックでフィルタ</h2>
        <p className="content-text">
          聖遺物画像またはキャラクターアイコンをクリックすると、
          聖遺物セットでのフィルタリングメニューが表示されます。
        </p>
      </section>
    </div>
  )
}

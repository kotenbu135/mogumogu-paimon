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
          等を利用してゲームから聖遺物データをエクスポートします。
        </p>
        <p className="content-text">
          irminsulはGOOD（Genshin Open Object Description）形式のJSONファイルを
          生成するツールです。
        </p>
        <p className="content-text">
          なお、irminsul以外にもGOODファイルを生成できるツールがあります。
        </p>
        <ol className="content-list">
          <li>
            <a
              href="https://artiscan.ninjabay.org/#/about"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              Artiscan
            </a>
          </li>
          <li>
            <a
              href="https://github.com/taiwenlee/Inventory_Kamera/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              Inventory Kamera
            </a>
          </li>
          <li>
            <a
              href="https://github.com/D1firehail/AdeptiScanner-GI/blob/master/README.md"
              target="_blank"
              rel="noopener noreferrer"
              className="content-link"
            >
              AdeptiScanner
            </a>
          </li>
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
        </p>
        <p className="content-text">
          各カードにはスコアとサブステータスの詳細が表示されます。
        </p>
        <p className="content-text">
          Lv20まで強化した聖遺物のみ表示されます。
        </p>
      </section>
    </div>
  )
}

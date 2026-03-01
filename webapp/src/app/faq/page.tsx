export default function FaqPage() {
  return (
    <div className="page-container">
      <h1 className="page-title">よくある質問</h1>

      <section className="content-section">
        <h3 className="subsection-title">Q. GOODファイルとはなんですか？</h3>
        <p className="content-text">
          GOOD（Genshin Open Object
          Description）は、原神のデータを解析可能なJSON形式にマッピングするためのデータフォーマット仕様です。
          これは、開発者やプログラマーが手動での変換作業を介さず、スムーズにデータを移行・共有できるようにするための標準規格として設計されました。
        </p>
        <p className="content-text">
          参考：
          <a
            href="https://frzyc.github.io/genshin-optimizer/#/doc"
            target="_blank"
            rel="noopener noreferrer"
            className="content-link"
          >
            Genshin Optimizer - GOOD Format Documentation
          </a>
        </p>
      </section>

      <section className="content-section">
        <h3 className="subsection-title">
          Q. GOODファイルを取得するのは安全ですか？
        </h3>
        <p className="content-text">
          今のところBAN報告は聞いていませんが、利用は自己責任でお願いします。
        </p>
      </section>
    </div>
  )
}

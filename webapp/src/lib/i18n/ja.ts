import type { Translations } from './types'

export const ja: Translations = {
  lang: 'ja',
  siteTitle: 'もぐもぐパイモン - 聖遺物スコア -',

  nav: {
    home: 'ホーム',
    aboutScore: 'スコアについて',
    aboutReconstruction: '再構築について',
    howToUse: '使い方',
    faq: 'よくある質問',
    disclaimer: '免責事項',
  },

  slots: {
    flower: '生の花',
    plume: '死の羽',
    sands: '時の砂',
    goblet: '空の杯',
    circlet: '理の冠',
  },

  stats: {
    hp: 'HP',
    atk: '攻撃力',
    def: '防御力',
    hp_: 'HP%',
    atk_: '攻撃力%',
    def_: '防御力%',
    enerRech_: '元素チャージ効率',
    eleMas: '元素熟知',
    critRate_: '会心率',
    critDMG_: '会心ダメージ',
  },

  mainStatExtra: {
    heal_: '治癒ボーナス',
    anemo_dmg_: '風元素ダメージ',
    cryo_dmg_: '氷元素ダメージ',
    dendro_dmg_: '草元素ダメージ',
    electro_dmg_: '雷元素ダメージ',
    geo_dmg_: '岩元素ダメージ',
    hydro_dmg_: '水元素ダメージ',
    pyro_dmg_: '炎元素ダメージ',
    physical_dmg_: '物理ダメージ',
  },

  scoreFormulas: {
    CV: { label: 'CVスコア', formula: '会心率×2 + 会心ダメージ' },
    HP型: { label: 'HP型', formula: 'CV + HP%×1.0' },
    攻撃型: { label: '攻撃型', formula: 'CV + 攻撃力%×1.0' },
    防御型: { label: '防御型', formula: 'CV + 防御力%×0.8' },
    熟知型: { label: '熟知型', formula: 'CV + 元素熟知×0.25' },
    チャージ型: { label: 'チャージ型', formula: 'CV + 元素チャージ×0.9' },
    最良型: { label: '最良型', formula: '全タイプのうち最高値' },
  },

  setGroupLabels: {
    'メインアタッカー用(v4以降)': 'メインアタッカー用(v4以降)',
    'サブアタッカー用': 'サブアタッカー用',
    'サポート用': 'サポート用',
    'メインアタッカー用（v3以前）': 'メインアタッカー用（v3以前）',
    'その他': 'その他',
  },

  artifactSetNames: {},

  upload: {
    drop: 'GOODファイルをドロップ',
    click: 'またはクリックしてJSONを選択',
    errorFormat: 'GOODフォーマットのJSONを選択してください',
    errorParse: 'JSONの解析に失敗しました',
    errorSize: 'ファイルサイズが大きすぎます（上限: 10MB）',
    loading: '聖遺物データを読み込み中…',
  },

  controls: {
    scoreType: 'スコアタイプ',
    set: 'セット',
    slot: '部位',
    allSlots: 'すべての部位',
    mainStat: 'メインステ',
    allMainStats: 'すべて',
    initialOp: '初期OP',
    allOps: 'すべて',
    op3: '3OP',
    op4: '4OP',
    substatFilter: 'サブステ（AND）',
    substatBtn: 'サブステ',
    substatSort: 'サブステソート',
    byScore: 'スコア順',
    reconstruction: '再構築',
    byOdds: 'オッズ順',
    filterClear: 'フィルタをクリア',
    filterBySet: 'セット',
    filterBySlot: '部位',
  },

  reconTypes: {
    normal: '通常再構築',
    advanced: '上級再構築',
    absolute: '絶対再構築',
  },

  card: {
    clickToFilter: 'クリックしてフィルタ',
    clickToFilterEquipped: 'クリックして装備セットでフィルタ',
    filterSet: 'セット',
    filterSlot: '部位',
  },

  pages: {
    aboutScore: {
      title: 'スコアについて',
      whatIsScore: {
        heading: 'スコアとは',
        p1: 'スコアは聖遺物のサブステータスの強さを数値で表したものです。',
        p2: '会心率・会心ダメージを基本とし、キャラクターのビルドに合わせて加算するステータスを選べます。',
      },
      cv: {
        heading: 'CVスコア（会心スコア）',
        p1: 'CVスコア（Crit Value）は、聖遺物の評価によく使われる基本的な指標です。',
        formula: 'CV = 会心率 × 2 + 会心ダメージ',
        p2: '一般的に、CVスコアが高いほど会心ステータスが優れた聖遺物と言えます。',
        tier55: '55以上 — 非常に優秀',
        tier45: '45〜54 — 優秀',
        tier35: '35〜44 — 良好',
        tierDefault: '35未満 — 普通',
      },
      formulaList: {
        heading: 'スコア計算方式一覧',
        p1: '各ビルドに特化したスコアタイプから選んで評価できます。',
      },
      mainStatFilter: {
        heading: 'メインステとスコアタイプの対応',
        p1: 'HP%・攻撃力%・防御力%・元素熟知・元素チャージ効率がメインステの場合、そのメインステに対応しないスコアタイプのスコアは 0 になります。',
        p2: '例：メインステが「元素熟知」の場合、熟知型スコアは通常通り計算されますが、HP型・攻撃型・防御型・チャージ型のスコアは 0 になります。',
        tableHeaders: { scoreType: 'スコアタイプ', mainStat: '対応するメインステ' },
        rows: [
          { scoreType: 'HP型', mainStat: 'HP%' },
          { scoreType: '攻撃型', mainStat: '攻撃力%' },
          { scoreType: '防御型', mainStat: '防御力%' },
          { scoreType: '熟知型', mainStat: '元素熟知' },
          { scoreType: 'チャージ型', mainStat: '元素チャージ効率' },
        ],
        note: '花（HP固定）・羽（攻撃力固定）・元素ダメージ系など「型なし」のメインステは対象外で、通常通り計算されます。CVスコアもメインステの影響を受けません。',
      },
    },

    aboutReconstruction: {
      title: '再構築について',
      whatIs: {
        heading: '再構築とは',
        p1: '再構築は、聖遺物のサブステータスの強化ロールをやり直す機能です。メインステータス・セット・部位はそのままに、サブステータスの強化結果だけがリセットされます。',
        p2: '再構築時には2つのサブステータスを選択でき、選んだサブステに一定回数以上のロールが保証されます。',
      },
      types: {
        heading: '再構築の種類',
        p1: '再構築には3つの種類があり、選択した2つのサブステータスへの保証ロール数が異なります。',
        normal: '通常再構築 — 選択した2つのサブステに合計2ロール以上を保証',
        advanced: '上級再構築 — 選択した2つのサブステに合計3ロール以上を保証',
        absolute: '絶対再構築 — 選択した2つのサブステに合計4ロール以上を保証',
        p2: '保証ロール数が多いほど、狙ったサブステに強化が集中しやすくなります。',
      },
      successRate: {
        heading: '成功率の計算方法',
        p1: '本サイトでは、再構築でスコアが向上する確率を多項分布に基づいて算出しています。計算手順は以下のとおりです。',
        steps: [
          '強化N回を4つのサブステに振り分ける全パターンを列挙',
          '保証条件（選択2サブステへの合計ロール数 ≧ 閾値）を満たすパターンのみを抽出',
          '各パターンの再構築後スコアを期待値ベースで算出',
          '現在のスコアを上回るパターンの確率を合計し、成功率として表示',
        ],
        p2: '各パターンの確率は多項分布（各サブステに均等な確率 1/4 で振り分け）で計算しています。',
      },
      guarantee: {
        heading: '保証サブステの選択',
        p1: '成功率の計算では、スコアタイプに応じて最適な保証サブステのペアを自動で選択しています。',
        basic: '基本 — 会心率 + 会心ダメージの2つを保証サブステとして選択',
        circlet: '理の冠（メインが会心系） — メインステと同じサブステは出現しないため、残りの会心ステとスコアタイプ固有ステ（例: HP型なら会心ダメージ + HP%）のペアを使用',
        cvCirclet: 'CV型で理の冠の場合 — 会心系以外の固有ステがないため、成功率は計算できません',
      },
      precision: {
        heading: '精度に関する注意事項',
        p1: '表示される成功率は近似値であり、実際の結果とは異なる場合があります。これは以下の理由によるものです。',
        bullets: [
          'GOODファイルには強化前の初期サブステータス値が含まれていないため、初期値は「現在値 − 平均強化幅 × 推定ロール数」で推定しています',
          '各サブステの強化ロール数自体も、現在の値から逆算した推定値です',
          '強化1回あたりのサブステ上昇値は4段階（低・中・高・最高）のいずれかですが、計算では平均値を使用しています',
        ],
        p2: 'これらの制約により、成功率はあくまで参考値としてご利用ください。',
      },
    },

    howToUse: {
      title: '使い方',
      step1: {
        heading: '1. GOODファイルを取得する',
        p1pre: '',
        p1link: 'irminsul',
        p1post: '等を利用してゲームから聖遺物データをエクスポートします。',
        p2: 'irminsulはGOOD（Genshin Open Object Description）形式のJSONファイルを生成するツールです。',
        p3: 'なお、irminsul以外にもGOODファイルを生成できるツールがあります。',
      },
      step2: {
        heading: '2. GOODファイルを読み込む',
        p1: 'ホーム画面のドラッグ&ドロップエリアにGOODファイルをドロップするか、クリックしてファイルを選択します。',
      },
      step3: {
        heading: '3. 聖遺物を確認する',
        p1: 'ファイルを読み込むと★5聖遺物が一覧表示されます。',
        p2: '各カードにはスコアとサブステータスの詳細が表示されます。',
        p3: 'Lv20まで強化した聖遺物のみ表示されます。',
      },
    },

    faq: {
      title: 'よくある質問',
      q1: {
        q: 'Q. GOODファイルとはなんですか？',
        a: 'GOOD（Genshin Open Object Description）は、原神のデータを解析可能なJSON形式にマッピングするためのデータフォーマット仕様です。これは、開発者やプログラマーが手動での変換作業を介さず、スムーズにデータを移行・共有できるようにするための標準規格として設計されました。',
        refLabel: 'Genshin Optimizer - GOOD Format Documentation',
      },
      q2: {
        q: 'Q. GOODファイルを取得するのは安全ですか？',
        a: '今のところBAN報告は聞いていませんが、利用は自己責任でお願いします。',
      },
    },

    disclaimer: {
      title: '免責事項',
      responsibility: {
        heading: 'ユーザーの責任と行動に関する方針',
        p1: '当サービスを利用するユーザーは、本ツールを通じて取得した情報を適切に使用する責任を負います。',
        p2: 'ユーザーは、当サービスを利用することにより、他人の権利を尊重し、すべての適用される法律および規則を遵守することに同意します。',
        p3: '違反が発覚した場合、サービスの利用停止や法的措置を含む厳格な対応が取られることがあります。',
      },
      disclaimer: {
        heading: '免責',
        p1: '当サイトの利用により生じたいかなる損害についても、当サイトは一切の責任を負いません。GOODファイルの取得・利用を含むすべての操作は、ユーザーご自身の判断と責任のもとで行ってください。',
      },
    },
  },
}

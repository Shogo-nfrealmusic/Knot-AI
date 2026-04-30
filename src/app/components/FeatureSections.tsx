interface FeatureSectionProps {
  title: string;
  description: string;
  highlights: { title: string; description: string }[];
  reverse?: boolean;
}

function FeatureSection({
  title,
  description,
  highlights,
  reverse = false,
}: FeatureSectionProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 ${
            reverse ? "lg:grid-flow-dense" : ""
          }`}
        >
          {/* Text content */}
          <div
            className={`min-w-0 space-y-6 sm:space-y-8 ${reverse ? "lg:col-start-2" : ""}`}
          >
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary whitespace-pre-line break-words">
              {title}
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em] max-w-lg break-words">
              {description}
            </p>
          </div>

          {/* Visual / Highlights */}
          <div
            className={`min-w-0 space-y-4 sm:space-y-6 ${reverse ? "lg:col-start-1 lg:row-start-1" : ""}`}
          >
            {highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="border border-border rounded-lg p-6 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
              >
                <h3 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-2">
                  {highlight.title}
                </h3>
                <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                  {highlight.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const sections: FeatureSectionProps[] = [
  {
    title: "事業者・個人事業主の方へ",
    description:
      "「AI を使って業務をもっと楽にしたい」「問い合わせ対応や事務作業を減らしたい」「サービスや商品の見せ方も整えたい」——そうした課題に対して、企画・整理・設計・制作まで一貫してサポートします。",
    highlights: [
      {
        title: "業務の整理から",
        description:
          "いまの進め方を一緒に棚卸しし、優先したいことと後回しにできることを切り分けます。",
      },
      {
        title: "制作までワンストップ",
        description:
          "LP・Web・EC・画面設計・試作まで、必要な範囲をつなげてご提案します。",
      },
      {
        title: "無理のないペース",
        description:
          "人手や予算に合わせて段階的に進め、運用し続けられる形を重視します。",
      },
    ],
  },
  {
    title: "AI 業務自動化\n（いまの流れに合わせて）",
    description:
      "単に AI ツールを導入するだけではなく、今の業務の流れに合わせて、無理なく使える形に落とし込むことを大切にしています。",
    highlights: [
      {
        title: "ツール選定と役割分担",
        description:
          "ご利用中のサービスやチームの習慣を踏まえ、何を自動化し、人が残すべき判断は何かをはっきりさせます。",
      },
      {
        title: "問い合わせ・事務の削減",
        description:
          "定型対応の下書き、振り分け、記録の自動化など、現場で負担の大きい部分から設計します。",
      },
      {
        title: "運用しやすい設計",
        description:
          "導入して終わりではなく、日常で回せる手順と、トラブル時の見通しまで含めて整えます。",
      },
    ],
    reverse: true,
  },
  {
    title: "仕組みづくりと\n見せ方づくり",
    description:
      "業務自動化だけでなく、サービス紹介用の LP や Web サイト、EC サイト、画面設計、試作開発にも対応しています。「仕組み」と「見せ方」をまとめて相談できるのが特徴です。",
    highlights: [
      {
        title: "LP・Web・EC",
        description:
          "集客や説明に使うページから、商品やサービスを載せる EC まで、目的に合わせて構成と制作を行います。",
      },
      {
        title: "UI/UX・プロトタイプ",
        description:
          "画面の情報設計やワイヤー、試作レベルの動くモックまで、検証しながら形にします。",
      },
      {
        title: "ブランドに合わせた表現",
        description:
          "事業のトーンや顧客層に合わせて、文章・ビジュアル・導線のバランスを整えます。",
      },
    ],
  },
  {
    title: "まだ何を頼めばいいか\nはっきりしない方へ",
    description:
      "「何を頼めるのかまだはっきりしていない」「AI に興味はあるけど、何から始めればいいか分からない」——そんな段階からでも相談しやすい形で、事業に合った進め方をご提案しています。",
    highlights: [
      {
        title: "ヒアリングから一緒に",
        description:
          "課題の言語化が難しいときも、質問と例を通じて、やりたいことの輪郭を一緒に作ります。",
      },
      {
        title: "小さく試して広げる",
        description:
          "一度に全部を変えず、効果が見えやすいところから試し、うまくいった流れを横に展開します。",
      },
      {
        title: "継続的な相談も可",
        description:
          "単発の制作だけでなく、運用しながらの改善や追加の自動化も、都度ご相談いただけます。",
      },
    ],
    reverse: true,
  },
];

export default function FeatureSections() {
  return (
    <>
      {sections.map((section) => (
        <FeatureSection key={section.title} {...section} />
      ))}
    </>
  );
}

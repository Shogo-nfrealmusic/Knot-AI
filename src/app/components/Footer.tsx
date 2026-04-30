import Image from "next/image";

const columns = [
  {
    title: "サービス",
    links: [
      "AI 業務自動化",
      "Web 制作",
      "LP 制作",
      "EC 制作",
      "UI/UX 設計",
      "プロトタイプ開発",
      "ご相談の流れ",
    ],
  },
  {
    title: "情報",
    links: [
      "実績・事例",
      "料金の目安",
      "よくある質問",
      "ブログ・記事",
      "利用規約",
      "プライバシー",
    ],
  },
  {
    title: "Evimeria",
    links: [
      "プロフィール",
      "事業内容",
      "対応エリア",
      "スケジュール",
    ],
  },
  {
    title: "リソース",
    links: [
      "お問い合わせフォーム",
      "無料相談",
      "資料請求",
      "テンプレート（準備中）",
    ],
  },
  {
    title: "連絡先",
    links: [
      "メール",
      "X（旧 Twitter）",
      "note",
      "GitHub",
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border-solid bg-bg-primary">
      <div className="mx-auto max-w-[1344px] px-4 sm:px-6 lg:px-14 py-14">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-8 lg:grid-cols-6">
          {/* Logo */}
          <div className="col-span-2 lg:col-span-1">
            <Image
              src="/images/evimeria-logo.png"
              alt="Evimeria"
              width={20}
              height={20}
              className="h-5 w-5 invert opacity-80"
            />
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="text-[13px] font-semibold text-text-primary tracking-[-0.008em] mb-6">
                {col.title}
              </h3>
              <ul className="space-y-0.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="block py-1 text-[13px] text-text-secondary hover:text-text-primary transition-colors tracking-[-0.008em]"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom row */}
        <div className="mt-20 flex flex-wrap gap-x-5 gap-y-2">
          {["プライバシー", "利用規約", "DPA"].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[13px] text-text-muted hover:text-text-secondary transition-colors tracking-[-0.008em]"
            >
              {link}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

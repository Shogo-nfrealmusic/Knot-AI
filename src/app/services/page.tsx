import type { Metadata } from "next";
import Link from "next/link";
import SitePageLayout from "@/app/components/SitePageLayout";
import CTA from "@/app/components/CTA";

export const metadata: Metadata = {
  title: "サービス | Evimeria",
  description:
    "AI 業務自動化、Web・LP・EC の制作、UI/UX・プロトタイプ設計。事業者・個人事業主向けに企画から制作・運用改善まで一貫して対応します。",
};

/* ─── Hero ─────────────────────────────────────────────── */
function ServicesHero() {
  return (
    <section className="pt-[200px] pb-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase tracking-widest mb-6 block">
          Services
        </span>
        <div className="mb-8">
          <h1 className="text-[clamp(2.5rem,5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.022em] text-text-primary">
            仕組みと見せ方を、
            <br />
            まとめてお任せください。
          </h1>
        </div>
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between lg:gap-8">
          <p className="min-w-0 flex-1 text-[15px] text-text-secondary tracking-[-0.01em] leading-relaxed max-w-2xl">
            AI を使った業務の自動化・効率化から、LP・Web・EC の制作、
            UI/UX・プロトタイプの設計まで。
            「何から手をつければいいか分からない」という段階でもご相談いただけます。
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 lg:max-w-[min(100%,22rem)] lg:justify-end lg:shrink-0">
            <div className="w-4 h-4 rounded-lg bg-accent/15 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-[3px] bg-accent" />
            </div>
            <span className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
              まとめて一つの窓口で
            </span>
            <Link
              href="/contact"
              className="text-[15px] text-text-secondary tracking-[-0.01em] whitespace-nowrap hover:text-text-primary transition-colors"
            >
              まずは相談する <span className="text-text-muted">&rarr;</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Service overview cards ────────────────────────────── */
const serviceCards = [
  {
    index: "01",
    title: "AI 業務自動化",
    description:
      "問い合わせ対応・定型メール・フォーム処理・ナレッジ整理など、毎日繰り返す作業を自動化します。ツール選定から設計・実装・運用フローの整備まで。",
    tags: ["問い合わせ自動化", "メール下書き生成", "フォーム連携", "チャットボット", "タスク振り分け"],
    visual: (
      <div className="w-full space-y-2 font-mono text-[11px]">
        {[
          { label: "フォーム受信", status: "done", indent: 0 },
          { label: "カテゴリ判定", status: "done", indent: 1 },
          { label: "担当者へ通知", status: "done", indent: 1 },
          { label: "返信下書き生成", status: "running", indent: 1 },
          { label: "人による確認・送信", status: "pending", indent: 0 },
        ].map((step) => (
          <div
            key={step.label}
            className="flex items-center gap-2"
            style={{ paddingLeft: step.indent * 16 }}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                step.status === "done"
                  ? "bg-accent/60"
                  : step.status === "running"
                  ? "bg-accent animate-pulse"
                  : "bg-white/10"
              }`}
            />
            <span
              className={
                step.status === "pending"
                  ? "text-text-muted"
                  : "text-text-secondary"
              }
            >
              {step.label}
            </span>
            {step.status === "running" && (
              <span className="text-accent/60 text-[10px]">実行中</span>
            )}
          </div>
        ))}
      </div>
    ),
  },
  {
    index: "02",
    title: "Web・LP・EC",
    description:
      "サービス紹介の LP・コーポレートサイト・EC まで。構成案の整理からデザイン・コーディング・公開まで対応。商品やサービスの「伝わり方」も一緒に考えます。",
    tags: ["LP 制作", "コーポレートサイト", "EC 構築", "リニューアル", "CMS 導入"],
    visual: (
      <div className="w-full space-y-1.5">
        <div className="h-6 rounded-md bg-white/[0.04] border border-border flex items-center px-2 gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
          <div className="h-1.5 w-16 rounded-full bg-white/10" />
          <div className="h-1.5 flex-1 rounded-full bg-white/5 ml-auto max-w-[60px]" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <div className="col-span-2 h-16 rounded-md bg-white/[0.03] border border-border flex flex-col justify-end p-2 gap-1">
            <div className="h-1.5 w-3/4 rounded-full bg-white/15" />
            <div className="h-1 w-1/2 rounded-full bg-white/8" />
          </div>
          <div className="col-span-1 h-16 rounded-md bg-white/[0.02] border border-border" />
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-md bg-white/[0.02] border border-border flex flex-col justify-end p-1.5 gap-1">
              <div className="h-1 w-2/3 rounded-full bg-white/10" />
              <div className="h-1 w-1/2 rounded-full bg-white/6" />
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    index: "03",
    title: "UI/UX・プロトタイプ",
    description:
      "画面の情報設計・ワイヤーフレーム・動くプロトタイプの制作。仮説を素早く形にして検証するサイクルを回せるよう、仕組みづくりと並行して対応します。",
    tags: ["ワイヤーフレーム", "インタラクション設計", "Figma", "試作・検証", "デザインシステム"],
    visual: (
      <div className="w-full space-y-1.5">
        <div className="grid grid-cols-4 gap-1 mb-2">
          {["一覧", "詳細", "入力", "完了"].map((label, i) => (
            <div
              key={label}
              className={`h-5 rounded text-[9px] flex items-center justify-center font-mono ${
                i === 0
                  ? "bg-accent/20 border border-accent/30 text-accent"
                  : "bg-white/[0.03] border border-border text-text-muted"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="rounded-md border border-border bg-white/[0.02] p-2 space-y-1.5">
          <div className="h-3 w-1/2 rounded bg-white/10" />
          <div className="space-y-1">
            <div className="h-1.5 w-full rounded-full bg-white/[0.06]" />
            <div className="h-1.5 w-5/6 rounded-full bg-white/[0.06]" />
            <div className="h-1.5 w-4/6 rounded-full bg-white/[0.04]" />
          </div>
          <div className="grid grid-cols-2 gap-1 pt-1">
            <div className="h-6 rounded bg-accent/15 border border-accent/20 flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-accent/40" />
            </div>
            <div className="h-6 rounded bg-white/[0.03] border border-border flex items-center justify-center">
              <div className="h-1.5 w-8 rounded-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    ),
  },
];

function ServiceOverview() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-border">
          {serviceCards.map((card, i) => (
            <div
              key={card.index}
              className={`pt-10 pb-8 flex flex-col gap-6 ${
                i < serviceCards.length - 1
                  ? "md:pr-8 md:border-r md:border-border"
                  : ""
              } ${i > 0 ? "md:pl-8" : ""}`}
            >
              {/* Visual mockup */}
              <div className="rounded-xl border border-border bg-bg-card p-4 min-h-[160px] flex items-center">
                {card.visual}
              </div>

              {/* Text */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase">
                    {card.index}
                  </span>
                </div>
                <h2 className="text-[17px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
                  {card.title}
                </h2>
                <p className="text-[14px] text-text-secondary leading-relaxed tracking-[-0.01em]">
                  {card.description}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-auto">
                {card.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border-solid text-text-muted font-mono"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── AI 業務自動化 詳細 ────────────────────────────────── */
function AiSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div className="space-y-8">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 01
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              AI 業務自動化
              <br />
              <span className="text-text-secondary">
                ——いまの流れに合わせて。
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              AI ツールの「導入」が目的ではなく、現場で使い続けられる形にすることを重視しています。
              今の業務フローを整理したうえで、何を自動化し、何は人が判断するかを切り分けて設計します。
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "問い合わせ・メール対応の自動化",
                  detail:
                    "受信内容のカテゴリ判定・優先度付け・担当者通知・返信下書き生成を一連で構築。",
                },
                {
                  title: "フォーム連携と記録の自動化",
                  detail:
                    "フォームの送信データをスプレッドシートや Notion・Slack に自動で流す仕組み。",
                },
                {
                  title: "社内ナレッジの整理・検索",
                  detail:
                    "散在する FAQ や過去対応履歴をまとめ、チャットで検索できる形にします。",
                },
                {
                  title: "定型タスクの自動実行",
                  detail:
                    "週次レポートの集計・出力、定期的なリマインダー送信など、繰り返し作業の代行。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: mini workflow */}
          <div className="lg:sticky lg:top-24 space-y-3">
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              {/* Window chrome */}
              <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                <span className="text-[12px] font-semibold text-[#d0d6e0]">
                  自動化フロー
                </span>
                <span className="font-mono text-[10px] text-text-muted">
                  inquiry_router.yaml
                </span>
              </div>
              <div className="p-4 space-y-1 font-mono text-[12px]">
                {[
                  { depth: 0, text: "on: form_submit", color: "text-accent/70" },
                  { depth: 1, text: "classify:", color: "text-text-secondary" },
                  { depth: 2, text: 'model: "gpt-4o-mini"', color: "text-text-muted" },
                  { depth: 2, text: "labels: [新規, 見積, サポート]", color: "text-text-muted" },
                  { depth: 1, text: "notify:", color: "text-text-secondary" },
                  { depth: 2, text: "channel: slack #inquiries", color: "text-text-muted" },
                  { depth: 1, text: "draft_reply:", color: "text-text-secondary" },
                  { depth: 2, text: "template: reply.md", color: "text-text-muted" },
                  { depth: 2, text: "review_required: true", color: "text-accent/50" },
                ].map((line, i) => (
                  <div
                    key={i}
                    className={`${line.color}`}
                    style={{ paddingLeft: line.depth * 16 }}
                  >
                    {line.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "受信", count: "145", sub: "今月" },
                { label: "自動処理", count: "92%", sub: "対応済み" },
                { label: "手動確認", count: "8%", sub: "要確認" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-border bg-bg-card p-3 text-center"
                >
                  <p className="text-[18px] font-semibold text-[#d0d6e0] tracking-tight">
                    {stat.count}
                  </p>
                  <p className="text-[11px] text-text-muted mt-0.5">{stat.sub}</p>
                  <p className="text-[11px] font-mono text-text-secondary/40 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                よく使うツール連携
              </p>
              <div className="flex flex-wrap gap-1.5">
                {[
                  "Gmail", "Notion", "Slack", "Google Sheets",
                  "LINE公式", "Chatwork", "Make (旧Integromat)", "Zapier",
                ].map((tool) => (
                  <span
                    key={tool}
                    className="text-[11px] px-2 py-0.5 rounded-full border border-border-solid text-text-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Web・LP・EC 詳細 ────────────────────────────────── */
function WebSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start lg:grid-flow-dense">
          {/* Text (right on desktop) */}
          <div className="space-y-8 lg:col-start-2">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 02
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              Web・LP・EC
              <br />
              <span className="text-text-secondary">
                ——伝わり方から一緒に。
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              制作物の「作り方」だけでなく、「どう伝えるか」「誰に届けるか」という部分から一緒に整理します。
              テキストや構成も込みで相談しながら進められます。
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "LP・サービス紹介サイト",
                  detail:
                    "ターゲットと訴求ポイントを整理し、構成案・デザイン・コーディング・公開まで一貫して対応。",
                },
                {
                  title: "コーポレートサイト",
                  detail:
                    "会社紹介・採用・お問い合わせなど複数ページ構成に対応。CMS 導入でコンテンツ更新も自分でできる形に。",
                },
                {
                  title: "EC サイト",
                  detail:
                    "Shopify / BASE などを活用した EC の新規構築・リニューアル。商品ページの構成や購入フローの改善も。",
                },
                {
                  title: "既存サイトのリニューアル",
                  detail:
                    "「古くなってきた」「スマホで崩れる」「問い合わせが来ない」——現状の課題を整理して改修方針を提案します。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual (left on desktop) */}
          <div className="lg:col-start-1 lg:row-start-1 lg:sticky lg:top-24 space-y-2">
            {/* LP mockup */}
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border">
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
                <div className="flex-1 mx-2 h-4 rounded bg-white/[0.04] border border-border text-[9px] flex items-center px-2 text-text-muted font-mono">
                  evimeria.com/lp
                </div>
              </div>
              <div className="p-3 space-y-2">
                {/* Hero area */}
                <div className="rounded-lg bg-white/[0.02] border border-border p-3 space-y-2">
                  <div className="h-4 w-2/3 rounded-md bg-white/15" />
                  <div className="h-2.5 w-5/6 rounded-full bg-white/8" />
                  <div className="h-2 w-4/6 rounded-full bg-white/6" />
                  <div className="flex gap-2 pt-1">
                    <div className="h-6 w-16 rounded-full bg-accent/30 border border-accent/20" />
                    <div className="h-6 w-20 rounded-full bg-white/[0.04] border border-border" />
                  </div>
                </div>
                {/* Feature cards */}
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="rounded-md bg-white/[0.02] border border-border p-2 space-y-1">
                      <div className="w-4 h-4 rounded bg-white/8" />
                      <div className="h-1.5 w-full rounded-full bg-white/10" />
                      <div className="h-1 w-3/4 rounded-full bg-white/6" />
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="rounded-md bg-accent/10 border border-accent/15 p-2 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="h-2 w-24 rounded-full bg-white/15" />
                    <div className="h-1.5 w-20 rounded-full bg-white/8" />
                  </div>
                  <div className="h-6 w-14 rounded-full bg-accent/40 border border-accent/20" />
                </div>
              </div>
            </div>

            {/* Tech stack */}
            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                主な技術スタック
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[12px]">
                {[
                  ["Next.js / React", "モダン Web"],
                  ["Shopify / BASE", "EC"],
                  ["WordPress", "CMS"],
                  ["Tailwind CSS", "スタイリング"],
                  ["Vercel / Netlify", "ホスティング"],
                  ["Figma", "デザイン"],
                ].map(([name, cat]) => (
                  <div key={name} className="flex items-center gap-2 rounded-md border border-border p-2 bg-white/[0.01]">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent/40 shrink-0" />
                    <div>
                      <p className="text-[12px] text-[#d0d6e0] font-medium leading-none">{name}</p>
                      <p className="text-[10px] text-text-muted mt-0.5">{cat}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── UI/UX・プロトタイプ 詳細 ──────────────────────────── */
function UiSection() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Text */}
          <div className="space-y-8">
            <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block">
              Service 03
            </span>
            <h2 className="text-[clamp(1.75rem,3.5vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
              UI/UX・プロトタイプ
              <br />
              <span className="text-text-secondary">
                ——仮説を、動く形に。
              </span>
            </h2>
            <p className="text-[15px] text-text-secondary leading-relaxed tracking-[-0.01em]">
              「なんとなくこういうものを作りたい」という段階から、画面の構成・情報の流れ・操作感を一緒に設計します。
              早期に動くものを作って確認するプロセスで、手戻りを減らします。
            </p>
            <div className="space-y-3">
              {[
                {
                  title: "情報設計・ワイヤーフレーム",
                  detail:
                    "何をどこに置くか、どの順番で見せるかを整理。複雑な画面でも構造を可視化してから進みます。",
                },
                {
                  title: "インタラクション設計",
                  detail:
                    "ボタンの遷移・フォームの動き・エラー表示など、操作の流れを細かく設計します。",
                },
                {
                  title: "クリック可能なプロトタイプ",
                  detail:
                    "Figma を使って実際に動かせる試作を作成。ユーザーテストやクライアント確認に活用できます。",
                },
                {
                  title: "デザインシステムの整備",
                  detail:
                    "ボタン・フォーム・カードなどの共通コンポーネントを整理し、今後の画面追加をスムーズにします。",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="border border-border rounded-lg p-4 bg-white/[0.01] hover:bg-white/[0.02] transition-colors"
                >
                  <p className="text-[14px] font-semibold text-[#d0d6e0] tracking-[-0.01em] mb-1">
                    {item.title}
                  </p>
                  <p className="text-[13px] text-text-secondary leading-relaxed tracking-[-0.008em]">
                    {item.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: Figma-style wireframe mock */}
          <div className="lg:sticky lg:top-24 space-y-2">
            <div className="rounded-xl border border-border bg-bg-card overflow-hidden">
              {/* Figma-style header */}
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-accent/20 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-sm border border-accent/60" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#d0d6e0]">
                    Figma
                  </span>
                  <span className="text-[11px] text-text-muted">
                    / サービス LP プロトタイプ
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {["一覧", "詳細", "入力"].map((label, i) => (
                    <button
                      key={label}
                      className={`text-[10px] px-2 py-0.5 rounded ${
                        i === 0
                          ? "bg-accent/20 text-accent"
                          : "text-text-muted"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Canvas area */}
              <div className="p-4 bg-white/[0.005]">
                <div className="rounded-lg border border-border bg-bg-card p-3 space-y-2">
                  {/* Nav */}
                  <div className="flex items-center justify-between h-7 border-b border-border pb-2 mb-1">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-white/15" />
                      <div className="h-1.5 w-10 rounded-full bg-white/20" />
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-1.5 w-8 rounded-full bg-white/10" />
                      ))}
                    </div>
                  </div>
                  {/* Hero */}
                  <div className="py-4 space-y-2 text-center flex flex-col items-center">
                    <div className="h-3 w-1/2 rounded bg-white/20" />
                    <div className="h-2 w-2/3 rounded-full bg-white/10" />
                    <div className="h-2 w-1/2 rounded-full bg-white/8" />
                    <div className="mt-1 flex gap-2">
                      <div className="h-6 w-16 rounded-full bg-accent/30" />
                      <div className="h-6 w-16 rounded-full bg-white/8 border border-border" />
                    </div>
                  </div>
                  {/* Cards row */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="rounded border border-border p-2 space-y-1 bg-white/[0.01]">
                        <div className="h-6 rounded bg-white/[0.04]" />
                        <div className="h-1.5 w-full rounded-full bg-white/10" />
                        <div className="h-1 w-3/4 rounded-full bg-white/6" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Comment overlay */}
              <div className="border-t border-border px-3 py-2 flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-accent/20 flex items-center justify-center text-[8px] text-accent font-bold">
                  K
                </div>
                <p className="text-[11px] text-text-secondary">
                  ヒーローのコピー、もう少し短くできますか？
                </p>
                <span className="text-[10px] text-text-muted ml-auto whitespace-nowrap">
                  2分前
                </span>
              </div>
            </div>

            {/* Deliverables list */}
            <div className="rounded-xl border border-border bg-bg-elevated p-4 space-y-3">
              <p className="text-[12px] font-semibold text-text-secondary uppercase font-mono tracking-wider">
                成果物の例
              </p>
              <div className="space-y-1.5">
                {[
                  ["Figma ファイル", "全画面ワイヤー + コンポーネント集"],
                  ["プロトタイプ URL", "クリック可能な動作確認用リンク"],
                  ["画面仕様メモ", "各画面の状態・エラー・遷移の説明"],
                  ["スタイルガイド", "色・タイポ・スペーシングの定義"],
                ].map(([name, desc]) => (
                  <div key={name} className="flex gap-2 items-start text-[12px]">
                    <div className="mt-1.5 w-1 h-1 rounded-full bg-accent/40 shrink-0" />
                    <div>
                      <span className="text-[#d0d6e0] font-medium">{name}</span>
                      <span className="text-text-muted"> — {desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── 進め方 ─────────────────────────────────────────── */
const steps = [
  {
    num: "01",
    title: "ヒアリング・課題の整理",
    description:
      "現状の業務フローやお困りごとをざっくばらんに聞かせてください。何を頼めるかまだ分からない段階でも歓迎です。",
  },
  {
    num: "02",
    title: "提案・範囲の確定",
    description:
      "ヒアリングをもとに、優先順位と対応範囲をご提案。予算・スケジュールに合わせて調整します。",
  },
  {
    num: "03",
    title: "設計・制作・実装",
    description:
      "定期的に確認しながら進めます。途中でやりたいことが変わっても、柔軟に対応します。",
  },
  {
    num: "04",
    title: "引き渡し・継続サポート",
    description:
      "引き渡し後も運用しながら改善できます。単発でも、継続的な相談パートナーとしても対応可能です。",
  },
];

function HowItWorks() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="mx-auto max-w-[1344px] w-full min-w-0">
        <div className="mb-12">
          <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase block mb-4">
            How it works
          </span>
          <h2 className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-[1.15] tracking-[-0.022em] text-text-primary">
            進め方
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className={`py-8 flex flex-col gap-4 ${
                i < steps.length - 1
                  ? "lg:pr-8 lg:border-r lg:border-border"
                  : ""
              } ${i > 0 ? "lg:pl-8" : ""} ${
                i > 0 && i < 2 ? "sm:pl-8 sm:border-l sm:border-border" : ""
              }`}
            >
              <span className="font-mono text-[11.8px] text-text-secondary/40 uppercase">
                {step.num}
              </span>
              <div className="w-8 h-px bg-border-solid" />
              <h3 className="text-[15px] font-semibold text-[#d0d6e0] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="text-[14px] text-text-secondary leading-relaxed tracking-[-0.01em]">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Page ───────────────────────────────────────────── */
export default function ServicesPage() {
  return (
    <SitePageLayout>
      <ServicesHero />
      <ServiceOverview />
      <AiSection />
      <WebSection />
      <UiSection />
      <HowItWorks />
      <CTA />
    </SitePageLayout>
  );
}

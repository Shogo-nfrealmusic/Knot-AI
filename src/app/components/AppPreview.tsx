import Image from "next/image";

export default function AppPreview() {
  return (
    <section className="relative w-full min-w-0 px-0 pb-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-bg-primary to-transparent" />
      </div>

      <div
        className="relative mx-auto w-[min(100%,94vw)] min-w-0 max-w-full sm:w-[90%] md:w-[85%]"
        data-app-preview
      >
        {/* App window */}
        <div className="bg-bg-card-alt border border-border rounded-xl overflow-hidden shadow-2xl shadow-black/50 max-w-full min-w-0">
          {/* App chrome */}
          <div className="grid grid-cols-[232px_1fr] max-lg:grid-cols-1">
            {/* Sidebar */}
            <div className="p-2 max-lg:hidden">
              <div className="flex items-center justify-between px-2 h-7 mb-3">
                <div className="flex items-center gap-1.5">
                  <Image
                    src="/images/evimeria-logo.png"
                    alt=""
                    width={13}
                    height={13}
                    className="h-[13px] w-[13px] shrink-0 invert opacity-80"
                  />
                  <span className="text-[14px] font-semibold text-[#d0d6e0] tracking-tight">
                    Evimeria
                  </span>
                </div>
              </div>

              <nav className="space-y-0.5 opacity-80">
                {["受信トレイ", "進行中", "レビュー待ち", "完了"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0]"
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item}
                  </div>
                ))}

                <div className="pt-3 pb-1">
                  <span className="text-[13px] font-semibold text-text-muted px-1">
                    ワークスペース
                  </span>
                </div>
                {["クライアント案件", "自社サイト", "その他"].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0]"
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item}
                  </div>
                ))}

                <div className="pt-3 pb-1">
                  <span className="text-[13px] font-semibold text-text-muted px-1">
                    お気に入り
                  </span>
                </div>
                {[
                  { name: "問い合わせの自動整理", active: true },
                  { name: "サービス LP の構成案", active: false },
                  { name: "EC 商品ページ", active: false },
                  { name: "UI ワイヤー試作", active: false },
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`flex items-center gap-2 px-1.5 h-7 rounded-md text-[13px] font-semibold text-[#d0d6e0] ${
                      item.active ? "bg-white/[0.04]" : ""
                    }`}
                  >
                    <div className="w-3.5 h-3.5 rounded-sm bg-white/5" />
                    {item.name}
                  </div>
                ))}
              </nav>
            </div>

            {/* Main content area */}
            <div className="min-w-0 border-l border-border bg-bg-card rounded-lg m-1.5 sm:m-2 ml-0 max-lg:m-2 overflow-hidden">
              {/* 小画面: 左サイドバー代替の横スクロールナビ */}
              <div className="flex lg:hidden items-center gap-2 border-b border-white/5 px-3 py-2.5 overflow-x-auto [scrollbar-width:thin]">
                {["受信トレイ", "進行中", "問い合わせ"].map((label) => (
                  <button
                    key={label}
                    type="button"
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold ${
                      label === "問い合わせ"
                        ? "bg-white/[0.08] text-[#d0d6e0]"
                        : "text-text-secondary"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="grid min-w-0 grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.95fr)] lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
                {/* Issue view */}
                <div className="min-w-0">
                  {/* Header bar */}
                  <div className="flex min-w-0 items-center justify-between gap-2 min-h-11 px-3 sm:px-6 border-b border-white/5 py-2 sm:py-0">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-[#d0d6e0] truncate">
                        問い合わせの自動整理
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-semibold text-text-secondary">
                        02
                      </span>
                      <span className="text-xs text-text-muted">/</span>
                      <span className="text-xs text-text-muted">145</span>
                    </div>
                  </div>

                  {/* Issue content */}
                  <div className="p-4 sm:p-6 lg:p-12 space-y-5 sm:space-y-6 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-[#d0d6e0] tracking-[-0.012em] break-words">
                      問い合わせの自動整理
                    </h3>
                    <p className="text-[13px] sm:text-sm text-text-secondary leading-relaxed tracking-[-0.01em] break-words">
                      フォーム・メールの内容を読み取り、優先度とカテゴリを付与。担当者への通知と返信の下書きまで、いまの運用に合わせてつなぎます。{" "}
                      <code className="px-1.5 py-0.5 bg-white/5 border border-white/[0.08] rounded text-xs text-[#d0d6e0] font-mono">
                        inquiry_router
                      </code>{" "}
                      のルールは後から編集可能です。
                    </p>

                    <div>
                      <h4 className="text-base font-semibold text-[#d0d6e0] mb-4">
                        アクティビティ
                      </h4>

                      <div className="space-y-1">
                        {/* Activity items */}
                        <div className="flex items-start gap-2 min-h-6">
                          <Image
                            src="/images/avatar-karri.png"
                            alt="karri"
                            width={14}
                            height={14}
                            className="mt-0.5 shrink-0 rounded-full"
                          />
                          <p className="min-w-0 text-[11px] leading-snug text-text-muted sm:text-xs">
                            <span className="font-semibold">フォーム</span>{" "}
                            から問い合わせを受信 &middot;{" "}
                            <span className="font-semibold">Evimeria</span> が
                            案件化 &middot; 2分前
                          </p>
                        </div>
                        <div className="ml-2 w-px h-2 bg-border-solid" />
                        <div className="flex items-start gap-2 min-h-6">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white/5">
                            <div className="h-2 w-2 rounded-full bg-accent/40" />
                          </div>
                          <p className="min-w-0 text-[11px] leading-snug text-text-muted sm:text-xs">
                            <span className="font-semibold">
                              業務自動化エージェント
                            </span> がラベル{" "}
                            <span className="font-semibold">新規</span>・
                            <span className="font-semibold">見積</span> を付与{" "}
                            &middot; 2分前
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Comment card */}
                    <div className="space-y-3 rounded-md border border-white/[0.08] bg-white/[0.01] p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/avatar-karri.png"
                          alt="karri"
                          width={14}
                          height={14}
                          className="rounded-full"
                        />
                        <span className="text-xs font-semibold text-[#d0d6e0]">
                          karri
                        </span>
                        <span className="text-xs font-semibold text-text-muted">
                          &middot; 4分前
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary tracking-[-0.008em]">
                        問い合わせがメールだけだと、誰が返すか・期限がバラバラで漏れそうで…
                      </p>
                      <div className="border-t border-border-solid pt-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/images/avatar-jori.png"
                            alt="jori"
                            width={14}
                            height={14}
                            className="rounded-full"
                          />
                          <span className="text-xs font-semibold text-[#d0d6e0]">
                            jori
                          </span>
                          <span className="text-xs font-semibold text-text-muted">
                            &middot; たった今
                          </span>
                        </div>
                        <p className="text-[13px] text-text-secondary ml-0 pl-0 sm:ml-6 sm:pl-0">
                          <span className="font-semibold">@Codex</span>{" "}
                          フォーム連携と下書き返信の流れ、試せる？
                        </p>
                      </div>
                    </div>

                    {/* Agent activity */}
                    <div className="border border-white/[0.08] bg-white/[0.01] rounded-md px-4 py-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Image
                          src="/images/avatar-codex.png"
                          alt="Codex"
                          width={14}
                          height={14}
                          className="rounded-full"
                        />
                        <span className="text-xs font-semibold text-[#d0d6e0]">
                          Codex
                        </span>
                      </div>
                      <p className="text-[13px] text-text-secondary tracking-[-0.008em]">
                        案件{" "}
                        <span className="font-mono text-text-muted text-xs">
                          REQ-1842
                        </span>{" "}
                        を処理中
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right sidebar - Agent chat */}
                <div className="flex min-h-[220px] w-full min-w-0 flex-col border-t border-white/5 bg-bg-elevated md:min-h-0 md:max-w-none md:border-t-0 md:border-l lg:min-w-[260px] lg:max-w-[320px]">
                  {/* Chat header */}
                  <div className="flex items-center justify-between border-b border-white/5 px-3 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src="/images/avatar-codex.png"
                        alt="Codex"
                        width={16}
                        height={16}
                        className="rounded-lg"
                      />
                      <span className="text-xs font-semibold text-[#d0d6e0]">
                        Codex
                      </span>
                    </div>
                  </div>

                  {/* Chat content */}
                  <div className="max-h-[min(50vh,320px)] flex-1 space-y-3 overflow-y-auto px-3 py-3 text-[11px] sm:space-y-4 sm:px-5 sm:text-xs md:max-h-none">
                    <p className="text-text-secondary">
                      了解。フォーム→スプレッドシート→Slack の流れを確認します。
                    </p>
                    <p className="text-text-secondary">
                      ワークスペース{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        client/inquiry-bot
                      </code>{" "}
                      を開きました。
                    </p>
                    <p className="text-text-secondary">
                      既存の{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        routing.yaml
                      </code>{" "}
                      を読み込み中
                    </p>
                    <pre className="font-mono text-[11.8px] text-text-muted leading-relaxed overflow-x-auto max-w-full rounded bg-black/20 p-2">
                      {`client/inquiry-bot$ npx workflow validate\nOK: 3 steps, 2 branches`}
                    </pre>
                    <p className="text-text-secondary">
                      返信テンプレ{" "}
                      <code className="font-mono text-text-muted text-[11.8px]">
                        draft_reply.md
                      </code>{" "}
                      の差し込み項目を確認中
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <div className="w-4 h-4 rounded-full border-2 border-text-muted border-t-transparent animate-spin" />
                      <span className="text-text-secondary">思考中</span>
                    </div>
                  </div>

                  {/* Chat input */}
                  <div className="p-2.5 sm:p-3">
                    <div className="rounded-md border border-white/[0.08] bg-white/[0.02] px-3 py-2.5 sm:px-4 sm:py-3">
                      <span className="text-[13px] text-text-muted">
                        Codex にメッセージ&hellip;
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

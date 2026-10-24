import type { Metadata } from "next";
import { linksContent, type LinksMode } from "@/lib/links";
import { fetchEvents, storeReady, type LinkEvent } from "@/lib/linksStore";
import { login, logout } from "./actions";
import { adminConfigured, isAdmin } from "./auth";

// Shogo's own view of /links: views, daily visitors, clicks, per side, per bio link (?src=), per link.

export const metadata: Metadata = {
  title: "Links admin",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const RANGES = [1, 7, 30, 90] as const;
const SIDE: Record<LinksMode, string> = { ai: "AI", fit: "FITNESS" };
const PLACE: Record<string, string> = {
  social: "SNSアイコン",
  highlight: "カード",
  pages: "一覧",
  // the fitness "On YouTube" list was removed on 2026-10-25; kept so its older clicks still read
  videos: "YouTube",
  closing: "最後のボタン",
  footer: "フッター",
};

/** id → readable name, built from the same content file the page renders. */
function linkLabels(): Record<string, string> {
  const map: Record<string, string> = {
    home: "shogo.build",
    closing: "最後のボタン",
    contact_sent: "お問い合わせフォームの送信",
    coaching_sent: "コーチング申し込みの送信",
    youtube_all: "YouTube（すべての動画）",
  };
  for (const side of [linksContent.ai, linksContent.fit]) {
    side.socials.forEach((s) => (map[s.id] = s.label));
    side.highlights.forEach((h) => (map[h.id] = h.title));
    side.pages.forEach((p) => (map[p.id] = p.label));
  }
  return map;
}

/** start of the range; kept outside the component so render stays pure */
const sinceIso = (days: number) => new Date(Date.now() - days * 86400_000).toISOString();

const tokyoDay = (iso: string) => new Date(new Date(iso).getTime() + 9 * 3600_000).toISOString().slice(0, 10);
const pct = (a: number, b: number) => (b ? `${((a / b) * 100).toFixed(1)}%` : "—");

function summarize(events: LinkEvent[]) {
  const views = events.filter((e) => e.kind === "view");
  const clicks = events.filter((e) => e.kind === "click");
  const switches = events.filter((e) => e.kind === "mode");
  // a visitor hash only lives for one Tokyo day, so "visitors" is daily uniques added up
  const visitors = (list: LinkEvent[]) => new Set(list.filter((e) => e.visitor).map((e) => `${tokyoDay(e.at)}|${e.visitor}`)).size;

  const bySide = (["ai", "fit"] as const).map((mode) => ({
    mode,
    views: views.filter((e) => e.mode === mode).length,
    visitors: visitors(views.filter((e) => e.mode === mode)),
    clicks: clicks.filter((e) => e.mode === mode).length,
    switchedTo: switches.filter((e) => e.mode === mode).length,
  }));

  const srcs = Array.from(new Set(events.map((e) => e.src)));
  const bySource = srcs
    .map((src) => {
      const v = views.filter((e) => e.src === src);
      return { src, views: v.length, visitors: visitors(v), clicks: clicks.filter((e) => e.src === src).length };
    })
    .sort((a, b) => b.views - a.views || b.clicks - a.clicks);

  const linkCounts = new Map<string, { target: string; mode: LinksMode; place: string; count: number }>();
  for (const c of clicks) {
    const k = `${c.target}|${c.mode}|${c.place}`;
    const row = linkCounts.get(k) ?? { target: c.target ?? "?", mode: c.mode, place: c.place ?? "", count: 0 };
    row.count += 1;
    linkCounts.set(k, row);
  }
  const byLink = Array.from(linkCounts.values()).sort((a, b) => b.count - a.count);

  const days = new Map<string, { views: number; clicks: number }>();
  for (const e of events) {
    const d = tokyoDay(e.at);
    const row = days.get(d) ?? { views: 0, clicks: 0 };
    if (e.kind === "view") row.views += 1;
    if (e.kind === "click") row.clicks += 1;
    days.set(d, row);
  }
  const byDay = Array.from(days.entries())
    .map(([day, v]) => ({ day, ...v }))
    .sort((a, b) => a.day.localeCompare(b.day));

  const mobile = views.filter((e) => e.device === "mobile").length;

  return {
    views: views.length,
    visitors: visitors(views),
    clicks: clicks.length,
    switches: switches.length,
    mobile,
    bySide,
    bySource,
    byLink,
    byDay,
    recent: events.slice(-25).reverse(),
  };
}

export default async function Page({ searchParams }: { searchParams: Promise<{ [k: string]: string | string[] | undefined }> }) {
  const q = await searchParams;

  if (!adminConfigured() || !storeReady()) {
    return (
      <Shell>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Links admin</h1>
        <p className="mt-3 text-[14px] text-neutral-600">
          まだ設定されていません。Vercel の環境変数に <code>LINKS_ADMIN_PASSWORD</code>・<code>LINKS_SUPABASE_URL</code>・
          <code>LINKS_SUPABASE_SERVICE_KEY</code> を入れて、再デプロイしてください。
        </p>
      </Shell>
    );
  }

  if (!(await isAdmin())) {
    return (
      <Shell>
        <form action={login} className="mx-auto mt-24 max-w-[320px]">
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Links admin</h1>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            autoFocus
            placeholder="Password"
            className="mt-6 h-11 w-full rounded-xl border border-neutral-300 bg-white px-4 text-[15px] outline-none focus:border-neutral-900"
          />
          {q.error ? <p className="mt-2 text-[13px] text-red-600">パスワードが違います</p> : null}
          <button className="mt-3 h-11 w-full rounded-xl bg-neutral-900 text-[14px] font-semibold text-white">Sign in</button>
        </form>
      </Shell>
    );
  }

  const days = RANGES.find((r) => String(r) === q.days) ?? 30;
  const s = summarize(await fetchEvents(sinceIso(days)));
  const labels = linkLabels();
  const peak = Math.max(1, ...s.byDay.map((d) => Math.max(d.views, d.clicks)));

  return (
    <Shell>
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em]">Links</h1>
          <p className="text-[13px] text-neutral-500">shogo.build/links ・ 日付は日本時間</p>
        </div>
        <div className="flex items-center gap-2">
          <nav className="flex rounded-full border border-neutral-200 bg-white p-1 text-[13px]">
            {RANGES.map((r) => (
              <a
                key={r}
                href={`/admin/links?days=${r}`}
                className={`rounded-full px-3 py-1 ${r === days ? "bg-neutral-900 text-white" : "text-neutral-600"}`}
              >
                {r === 1 ? "24時間" : `${r}日`}
              </a>
            ))}
          </nav>
          <form action={logout}>
            <button className="text-[12px] text-neutral-500 underline-offset-2 hover:underline">Sign out</button>
          </form>
        </div>
      </header>

      <section className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="表示" value={s.views} />
        <Stat label="訪問者（日ごとの重複なし）" value={s.visitors} />
        <Stat label="クリック" value={s.clicks} />
        <Stat label="クリック率" value={pct(s.clicks, s.views)} note={`スマホ ${pct(s.mobile, s.views)}・切り替え ${s.switches}回`} />
      </section>

      <Card title="側ごと（開いた側で数える）">
        <Table
          head={["側", "表示", "訪問者", "クリック", "クリック率", "この側へ切り替え"]}
          rows={s.bySide.map((r) => [SIDE[r.mode], r.views, r.visitors, r.clicks, pct(r.clicks, r.views), r.switchedTo])}
        />
      </Card>

      <Card title="流入元（?src=）">
        {s.bySource.length ? (
          <Table
            head={["src", "表示", "訪問者", "クリック", "クリック率"]}
            rows={s.bySource.map((r) => [r.src, r.views, r.visitors, r.clicks, pct(r.clicks, r.views)])}
          />
        ) : (
          <Empty />
        )}
      </Card>

      <Card title="リンクごとのクリック">
        {s.byLink.length ? (
          <Table
            head={["リンク", "側", "場所", "クリック"]}
            rows={s.byLink.map((r) => [labels[r.target] ?? r.target, SIDE[r.mode], PLACE[r.place] ?? r.place, r.count])}
          />
        ) : (
          <Empty />
        )}
      </Card>

      <Card title="日ごと">
        {s.byDay.length ? (
          <ul className="space-y-1.5">
            {s.byDay.map((d) => (
              <li key={d.day} className="grid grid-cols-[84px_1fr_88px] items-center gap-3 text-[12px]">
                <span className="font-mono text-neutral-500">{d.day.slice(5)}</span>
                <span className="relative block h-4">
                  <span className="absolute inset-y-0 left-0 rounded bg-neutral-200" style={{ width: `${(d.views / peak) * 100}%` }} />
                  <span className="absolute inset-y-1 left-0 rounded bg-neutral-900" style={{ width: `${(d.clicks / peak) * 100}%` }} />
                </span>
                <span className="text-right font-mono text-neutral-600">
                  {d.views} / {d.clicks}
                </span>
              </li>
            ))}
            <li className="pt-1 text-[11px] text-neutral-400">灰色 = 表示、黒 = クリック</li>
          </ul>
        ) : (
          <Empty />
        )}
      </Card>

      <Card title="最近の記録">
        {s.recent.length ? (
          <Table
            head={["時刻", "種類", "側", "src", "対象"]}
            rows={s.recent.map((e) => [
              new Date(e.at).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo", month: "numeric", day: "numeric", hour: "2-digit", minute: "2-digit" }),
              e.kind === "view" ? "表示" : e.kind === "click" ? "クリック" : "切り替え",
              SIDE[e.mode],
              e.src,
              e.target ? (labels[e.target] ?? e.target) : "",
            ])}
          />
        ) : (
          <Empty />
        )}
      </Card>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-[960px] px-4 py-10 sm:px-6">{children}</div>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: number | string; note?: string }) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4">
      <p className="text-[12px] text-neutral-500">{label}</p>
      <p className="mt-1 font-mono text-[28px] font-semibold tracking-[-0.03em]">{value}</p>
      {note ? <p className="mt-1 text-[11px] text-neutral-400">{note}</p> : null}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-6 rounded-2xl border border-neutral-200 bg-white p-5">
      <h2 className="mb-4 text-[14px] font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Table({ head, rows }: { head: string[]; rows: (string | number)[][] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-neutral-200 text-neutral-500">
            {head.map((h) => (
              <th key={h} className="whitespace-nowrap py-2 pr-4 font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-neutral-100 last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`py-2 pr-4 ${typeof c === "number" ? "font-mono" : ""}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Empty() {
  return <p className="text-[13px] text-neutral-400">まだ記録がありません。</p>;
}

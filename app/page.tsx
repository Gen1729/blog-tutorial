import { Markdown } from "@/components/markdown";
import { getMemos } from "@/lib/memos";

const dateFormatter = new Intl.DateTimeFormat("ja-JP", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default async function Home() {
  const memos = await getMemos();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.92),_rgba(241,245,249,0.88)_38%,_rgba(226,232,240,0.72)_100%)] text-slate-900">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10 sm:px-8 lg:px-10 lg:py-14">
        <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.35)] backdrop-blur sm:p-10 lg:p-12">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-sky-500 via-cyan-400 to-emerald-400" />
          <div className="max-w-3xl space-y-5">
            <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Memo Site
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Markdown で書いて、そのまま表示するメモサイト
            </h1>
            <p className="max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
              content/memos に Markdown ファイルを置くと、サーバー側で読み込んで一覧表示します。Vercel にそのままデプロイできる、最小構成のメモ置き場です。
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm text-slate-500">メモ数</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{memos.length}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm text-slate-500">保存方法</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Markdown</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
              <p className="text-sm text-slate-500">配備先</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Vercel</p>
            </div>
          </div>
        </section>

        <section className="grid gap-6">
          {memos.map((memo) => (
            <article
              key={memo.slug}
              className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.4)]"
            >
              <div className="border-b border-slate-200 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
                      Memo
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      {memo.title}
                    </h2>
                  </div>
                  <p className="text-sm text-slate-500">
                    更新日 {dateFormatter.format(new Date(memo.updatedAt))}
                  </p>
                </div>
                {memo.excerpt ? (
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
                    {memo.excerpt}
                  </p>
                ) : null}
              </div>
              <div className="px-6 py-6 sm:px-8">
                <div className="markdown">
                  <Markdown content={memo.content} />
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

"use client";
import Link from "next/link";
import {useI18n} from "@/components/i18n-provider";

export default function Home() {
  const {t}=useI18n();
  const features=[t("progressive"),t("sessions"),t("support")];
  const descriptions=[t("progressiveText"),t("sessionsText"),t("supportText")];
  return <main>
    <header className="container flex items-center justify-between py-6 pr-20">
      <Link href="/" className="text-xl font-black tracking-wide">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link>
      <nav className="flex gap-3 text-sm"><Link className="muted px-3 py-2" href="/login">{t("login")}</Link><Link className="btn" href="/register">{t("join")}</Link></nav>
    </header>
    <section className="container grid items-center gap-10 py-20 md:grid-cols-2">
      <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-[.25em]" style={{color:"#d7a84b"}}>{t("academy")}</p>
        <h1 className="text-5xl font-black leading-tight md:text-6xl">{t("hero1")} <span style={{color:"#d7a84b"}}>{t("hero2")}</span></h1>
        <p className="muted mt-6 max-w-xl text-lg">{t("intro")}</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link className="btn" href="/register">{t("access")}</Link><Link className="btn btn-secondary" href="/login">{t("student")}</Link></div>
        <p className="muted mt-4 text-xs">{t("risk")}</p>
      </div>
      <div className="panel p-8">
        <p className="muted text-sm">{t("membership")}</p>
        <div className="mt-3 text-6xl font-black">$200<span className="text-lg font-medium"> USD</span></div>
        <p className="muted mt-2">{t("oneTime")}</p>
        <hr className="my-6 border-slate-700"/>
        <ul className="space-y-3 text-sm"><li>✓ {t("courses")}</li><li>✓ {t("zoom")}</li><li>✓ {t("replays")}</li><li>✓ {t("analysis")}</li><li>✓ {t("community")}</li></ul>
        <Link href="/register" className="btn mt-8 w-full">{t("signupPrice")}</Link>
      </div>
    </section>
    <section className="container grid gap-4 pb-20 md:grid-cols-3">
      {features.map((feature,i)=><div className="panel p-6" key={feature}><div className="mb-3 text-2xl" style={{color:"#d7a84b"}}>0{i+1}</div><h2 className="font-bold">{feature}</h2><p className="muted mt-2 text-sm">{descriptions[i]}</p></div>)}
    </section>
    <footer className="container flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 py-8 pr-20 text-xs muted"><span>© {new Date().getFullYear()} ClasseTrading · Français / Español</span><nav className="flex flex-wrap gap-4"><Link href="/terms">{t("terms")}</Link><Link href="/privacy">{t("privacy")}</Link><Link href="/risk-disclosure">{t("riskLink")}</Link></nav></footer>
  </main>;
}

import Link from "next/link";

export default function Home() {
  return <main>
    <header className="container flex items-center justify-between py-6">
      <Link href="/" className="text-xl font-black tracking-wide">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link>
      <nav className="flex gap-3 text-sm"><Link className="muted px-3 py-2" href="/login">Se connecter</Link><Link className="btn" href="/register">Rejoindre</Link></nav>
    </header>
    <section className="container grid items-center gap-10 py-20 md:grid-cols-2">
      <div>
        <p className="mb-5 text-sm font-bold uppercase tracking-[.25em]" style={{color:"#d7a84b"}}>L'académie de trading</p>
        <h1 className="text-5xl font-black leading-tight md:text-6xl">Apprends à lire les marchés. <span style={{color:"#d7a84b"}}>Construis ta méthode.</span></h1>
        <p className="muted mt-6 max-w-xl text-lg">Une formation structurée en Forex, XAUUSD et analyse des marchés, avec cours, ressources et sessions en direct sur Zoom.</p>
        <div className="mt-8 flex flex-wrap gap-3"><Link className="btn" href="/register">Accéder à l'académie</Link><Link className="btn btn-secondary" href="/login">Espace étudiant</Link></div>
        <p className="muted mt-4 text-xs">Formation éducative. Le trading comporte un risque de perte en capital.</p>
      </div>
      <div className="panel p-8">
        <p className="muted text-sm">MEMBERSHIP · 30 JOURS</p>
        <div className="mt-3 text-6xl font-black">$200<span className="text-lg font-medium"> USD</span></div>
        <p className="muted mt-2">Paiement unique · Pas de renouvellement automatique</p>
        <hr className="my-6 border-slate-700"/>
        <ul className="space-y-3 text-sm"><li>✓ Cours structurés et leçons</li><li>✓ Sessions en direct sur Zoom</li><li>✓ Replays et supports pédagogiques</li><li>✓ Analyses Forex et XAUUSD</li><li>✓ Communauté privée des étudiants</li></ul>
        <Link href="/register" className="btn mt-8 w-full">S'inscrire pour 200 $</Link>
      </div>
    </section>
    <section className="container grid gap-4 pb-20 md:grid-cols-3">
      {["Formation progressive","Sessions Zoom","Suivi pédagogique"].map((t,i)=><div className="panel p-6" key={t}><div className="mb-3 text-2xl" style={{color:"#d7a84b"}}>0{i+1}</div><h2 className="font-bold">{t}</h2><p className="muted mt-2 text-sm">{["Des modules et leçons pour développer une méthode d'analyse.","Un calendrier de sessions en direct et des replays accessibles aux membres actifs.","Un espace personnel pour suivre les cours et la durée de son accès."][i]}</p></div>)}
    </section>
    <footer className="container border-t border-slate-800 py-8 text-xs muted">© {new Date().getFullYear()} ClasseTrading · Français / Español</footer>
  </main>;
}

import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase=createClient();
  const {data:{user}}=await supabase.auth.getUser();
  if(!user) redirect("/login");
  const [{data:profile},{data:membership},{data:payments}]=await Promise.all([
    supabase.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle(),
    supabase.from("memberships").select("starts_at,ends_at,status").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).order("ends_at",{ascending:false}).limit(1).maybeSingle(),
    supabase.from("payment_requests").select("status,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle()
  ]);
  const active=!!membership;
  return <main className="container min-h-screen py-8"><header className="flex flex-wrap items-center justify-between gap-4"><Link href="/" className="text-xl font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><div className="flex items-center gap-3"><span className="muted text-sm">{profile?.full_name||user.email}</span><form action="/auth/signout" method="post"><button className="btn btn-secondary">Déconnexion</button></form></div></header><section className="mt-12"><p className="muted text-sm">ESPACE ÉTUDIANT</p><h1 className="mt-2 text-3xl font-bold">Bonjour{profile?.full_name?" "+profile.full_name:""} 👋</h1><p className="muted mt-2">Bienvenue dans ton espace ClasseTrading.</p></section><section className="mt-8 grid gap-5 md:grid-cols-3"><div className="panel p-6 md:col-span-2"><p className="muted text-sm">STATUT DE TON ACCÈS</p><h2 className="mt-3 text-2xl font-bold">{active?"Membre actif":"Accès non activé"}</h2>{active?<p className="muted mt-2 text-sm">Fin d'accès : {new Date(membership!.ends_at).toLocaleString("fr-FR")}</p>:<p className="muted mt-2 text-sm">L'accès aux cours sera activé après vérification manuelle de ton paiement de 200 USD.</p>}<Link className="btn mt-6" href="/membership">{active?"Voir ma formule":"Demander mon accès"}</Link></div><div className="panel p-6"><p className="muted text-sm">DERNIÈRE DEMANDE</p><h2 className="mt-3 text-xl font-bold">{payments?.status==="pending"?"En attente":payments?.status==="approved"?"Approuvée":payments?.status==="rejected"?"Refusée":"Aucune"}</h2><p className="muted mt-2 text-sm">Paiement unique · 200 USD · 30 jours</p></div></section><section className="mt-8 grid gap-4 md:grid-cols-3">{[["Cours","/courses","Accède aux modules de formation."],["Classes Zoom","/classes","Consulte le calendrier et les liens de réunion."],["Mon accès","/membership","Soumets un paiement et suis son statut."]].map(([title,url,desc])=><Link key={url} href={url} className="panel p-6 transition hover:border-amber-400"><h3 className="font-bold">{title}</h3><p className="muted mt-2 text-sm">{desc}</p></Link>)}</section></main>;
}

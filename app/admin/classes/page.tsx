import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ClassManager from "./actions";
export default async function AdminClasses(){
 const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");
 const {data:p}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle();if(p?.role!=="admin")redirect("/dashboard");
 const {data:classes}=await s.from("live_classes").select("id,title,starts_at,is_published").order("starts_at",{ascending:false});
 return <main className="min-h-screen"><header className="site-header"><div className="container flex items-center justify-between"><Link href="/admin" className="brand">CLASSE<span>TRADING</span></Link><Link href="/admin" className="nav-link">← Administration</Link></div></header><section className="container py-10"><p className="eyebrow">ESPACE ADMINISTRATEUR</p><h1 className="mt-3 text-3xl font-extrabold md:text-4xl">Aulas Pocket Option</h1><p className="muted mt-3 max-w-2xl leading-7">Programme les démonstrations pratiques. Le formateur anime la session sur Zoom et les étudiants suivent les explications depuis leurs propres comptes Pocket Option.</p><div className="mt-7 rounded-2xl border border-amber-200/15 bg-amber-200/[.05] p-5"><p className="text-sm font-bold text-amber-100">Consigne pédagogique</p><p className="muted mt-2 text-sm leading-6">Indique clairement le thème, l'heure et les objectifs de la séance. N'ajoute jamais de demande de mot de passe ou d'identifiants Pocket Option.</p></div><h2 className="mb-4 mt-9 text-xl font-bold">Planifier et gérer les sessions</h2><ClassManager classes={classes||[]}/></section></main>;
}

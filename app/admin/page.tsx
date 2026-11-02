import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function AdminPage(){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role,full_name").eq("id",user.id).maybeSingle();if(profile?.role!=="admin")redirect("/dashboard");
 const [{count:students},{count:pending},{count:courses}]=await Promise.all([
  supabase.from("profiles").select("*",{count:"exact",head:true}).eq("role","student"),
  supabase.from("payment_requests").select("*",{count:"exact",head:true}).eq("status","pending"),
  supabase.from("courses").select("*",{count:"exact",head:true})
 ]);
 return <main className="container min-h-screen py-10"><header className="flex justify-between"><Link href="/" className="font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><span className="muted text-sm">Administration · {profile.full_name||user.email}</span></header><h1 className="mt-10 text-3xl font-bold">Tableau de bord administrateur</h1><div className="mt-8 grid gap-4 md:grid-cols-3">{[["Étudiants",students||0],["Paiements à vérifier",pending||0],["Cours",courses||0]].map(([t,n])=><div className="panel p-6" key={String(t)}><p className="muted text-sm">{t}</p><p className="mt-2 text-3xl font-black">{n}</p></div>)}</div><div className="mt-8 grid gap-4 md:grid-cols-2"><Link className="panel p-6" href="/admin/payments"><h2 className="font-bold">Vérifier les paiements</h2><p className="muted mt-2 text-sm">Approuver ou refuser les demandes. L'approbation active 30 jours d'accès.</p></Link><Link className="panel p-6" href="/admin/courses"><h2 className="font-bold">Cours et leçons</h2><p className="muted mt-2 text-sm">Créer les cours, ajouter des leçons et publier les contenus.</p></Link><Link className="panel p-6" href="/admin/classes"><h2 className="font-bold">Classes Zoom</h2><p className="muted mt-2 text-sm">Programmer les sessions, ajouter les liens Zoom et publier les replays.</p></Link></div></main>;
}

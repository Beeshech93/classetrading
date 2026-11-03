import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
export default async function AdminStudentsPage(){
 const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");
 const {data:admin}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle();if(admin?.role!=="admin")redirect("/dashboard");
 const [{data:students,error},{data:memberships}]=await Promise.all([
  s.from("profiles").select("id,full_name,created_at").eq("role","student").order("created_at",{ascending:false}),
  s.from("memberships").select("user_id,starts_at,ends_at,status").order("ends_at",{ascending:false})
 ]);
 const now=Date.now();const latest=new Map<string,any>();
 for(const m of memberships||[]){if(!latest.has(m.user_id))latest.set(m.user_id,m);}
 return <main className="container min-h-screen py-10"><Link href="/admin" className="muted text-sm">← Administration</Link><h1 className="mt-6 text-3xl font-bold">Étudiants</h1><p className="muted mt-2 text-sm">Liste des comptes et statut de leur accès.</p>{error&&<p className="mt-5 text-sm text-red-400">{error.message}</p>}<div className="mt-8 space-y-3">{(students||[]).map(st=>{const m=latest.get(st.id);const active=!!m&&m.status==="active"&&new Date(m.starts_at).getTime()<=now&&new Date(m.ends_at).getTime()>now;return <article className="panel flex flex-wrap items-center justify-between gap-3 p-5" key={st.id}><div><h2 className="font-bold">{st.full_name||"Étudiant sans nom"}</h2><p className="muted text-xs">{st.id}</p><p className="muted mt-1 text-xs">Inscrit : {new Date(st.created_at).toLocaleDateString("fr-FR")}</p></div><div className="text-right"><span className={active?"text-emerald-400":"text-amber-300"}>{active?"Accès actif":m?.status==="revoked"?"Accès révoqué":m?"Accès expiré":"Aucun abonnement"}</span>{m&&<p className="muted mt-1 text-xs">Expire le {new Date(m.ends_at).toLocaleDateString("fr-FR")}</p>}</div></article>})}</div>{!students?.length&&!error&&<p className="muted mt-5">Aucun étudiant inscrit pour le moment.</p>}</main>;
}

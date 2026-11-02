import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function ClassesPage(){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:member}=await supabase.from("memberships").select("id").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).limit(1).maybeSingle();if(!member)redirect("/membership");
 const {data:classes}=await supabase.from("live_classes").select("id,title,description,meeting_url,starts_at,ends_at,recording_url").eq("is_published",true).order("starts_at",{ascending:true});
 return <main className="container py-10"><Link href="/dashboard" className="muted text-sm">← Tableau de bord</Link><h1 className="mt-6 text-3xl font-bold">Classes en direct · Zoom</h1><p className="muted mt-2">Calendrier des sessions et rediffusions.</p><div className="mt-8 space-y-4">{classes?.map(c=><article className="panel p-6" key={c.id}><p className="muted text-xs">{new Date(c.starts_at).toLocaleString("fr-FR")}</p><h2 className="mt-2 text-xl font-bold">{c.title}</h2><p className="muted mt-2 text-sm">{c.description}</p><div className="mt-4 flex gap-4">{c.meeting_url&&<a className="btn" href={c.meeting_url} target="_blank" rel="noreferrer">Rejoindre sur Zoom</a>}{c.recording_url&&<a className="btn btn-secondary" href={c.recording_url} target="_blank" rel="noreferrer">Voir le replay</a>}</div></article>)}</div>{!classes?.length&&<p className="muted mt-5">Aucune classe publiée pour le moment.</p>}</main>;
}

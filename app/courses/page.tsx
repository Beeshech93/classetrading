import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function CoursesPage(){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:membership}=await supabase.from("memberships").select("id").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).limit(1).maybeSingle();
 if(!membership)return <main className="container py-16"><Link href="/dashboard" className="muted text-sm">← Tableau de bord</Link><div className="panel mt-8 p-8"><h1 className="text-2xl font-bold">Accès réservé aux membres</h1><p className="muted mt-2">Ton accès aux cours sera disponible après approbation du paiement.</p><Link className="btn mt-6" href="/membership">Demander mon accès</Link></div></main>;
 const {data:courses}=await supabase.from("courses").select("id,title,slug,description").eq("is_published",true).order("sort_order");
 return <main className="container py-10"><Link href="/dashboard" className="muted text-sm">← Tableau de bord</Link><h1 className="mt-6 text-3xl font-bold">Mes cours</h1>{!courses?.length?<p className="muted mt-5">Les cours seront publiés prochainement.</p>:<div className="mt-6 grid gap-4 md:grid-cols-3">{courses.map(c=><Link className="panel p-6" key={c.id} href={"/courses/"+c.slug}><h2 className="font-bold">{c.title}</h2><p className="muted mt-2 text-sm">{c.description}</p></Link>)}</div>}</main>;
}

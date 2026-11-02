import Link from "next/link";
import { notFound,redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export default async function CourseDetail({params}:{params:{slug:string}}){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:member}=await supabase.from("memberships").select("id").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).limit(1).maybeSingle();if(!member)redirect("/membership");
 const {data:course}=await supabase.from("courses").select("id,title,description").eq("slug",params.slug).eq("is_published",true).maybeSingle();if(!course)notFound();
 const {data:lessons}=await supabase.from("lessons").select("id,title,description,video_url,content,attachment_path").eq("course_id",course.id).eq("is_published",true).order("sort_order");
 return <main className="container py-10"><Link href="/courses" className="muted text-sm">← Mes cours</Link><h1 className="mt-6 text-3xl font-bold">{course.title}</h1><p className="muted mt-2">{course.description}</p><div className="mt-8 space-y-4">{lessons?.map((l,i)=><article className="panel p-6" key={l.id}><p className="muted text-xs">LEÇON {i+1}</p><h2 className="mt-2 text-xl font-bold">{l.title}</h2>{l.description&&<p className="muted mt-2 text-sm">{l.description}</p>}{l.content&&<div className="mt-4 whitespace-pre-wrap text-sm leading-7">{l.content}</div>}{l.video_url&&<a className="mt-4 inline-block underline" href={l.video_url} target="_blank" rel="noreferrer">Voir la vidéo</a>}</article>)}</div>{!lessons?.length&&<p className="muted mt-5">Les leçons seront bientôt disponibles.</p>}</main>;
}

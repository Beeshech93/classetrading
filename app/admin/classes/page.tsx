import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import ClassManager from "./actions";
export default async function AdminClasses(){const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");const {data:p}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle();if(p?.role!=="admin")redirect("/dashboard");const {data:classes}=await s.from("live_classes").select("id,title,starts_at,is_published").order("starts_at",{ascending:false});return <main className="container min-h-screen py-10"><Link href="/admin" className="muted text-sm">← Administration</Link><h1 className="my-6 text-3xl font-bold">Classes Zoom</h1><ClassManager classes={classes||[]}/></main>}

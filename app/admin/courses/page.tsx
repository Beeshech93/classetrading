import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import CourseManager from "./actions";
export default async function AdminCourses(){const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");const {data:p}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle();if(p?.role!=="admin")redirect("/dashboard");const {data:courses}=await s.from("courses").select("id,title,slug,is_published").order("created_at",{ascending:false});return <main className="container min-h-screen py-10"><Link href="/admin" className="muted text-sm">← Administration</Link><h1 className="mt-6 mb-6 text-3xl font-bold">Gestion des cours</h1><CourseManager courses={courses||[]}/></main>}

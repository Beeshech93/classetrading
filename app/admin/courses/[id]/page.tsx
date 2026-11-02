import Link from "next/link";
import {notFound,redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import LessonManager from "./actions";
export default async function CourseEditor({params}:{params:{id:string}}){const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user)redirect("/login");const {data:p}=await s.from("profiles").select("role").eq("id",user.id).maybeSingle();if(p?.role!=="admin")redirect("/dashboard");const {data:course}=await s.from("courses").select("id,title").eq("id",params.id).maybeSingle();if(!course)notFound();const {data:lessons}=await s.from("lessons").select("id,title,is_published").eq("course_id",course.id).order("sort_order");return <main className="container min-h-screen py-10"><Link href="/admin/courses" className="muted text-sm">← Cours</Link><h1 className="my-6 text-3xl font-bold">{course.title} · Leçons</h1><LessonManager courseId={course.id} lessons={lessons||[]}/></main>}

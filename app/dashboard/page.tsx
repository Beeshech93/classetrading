"use client";
import Link from "next/link";
import { useEffect,useState } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {useI18n} from "@/components/i18n-provider";

export default function DashboardPage() {
  const {t,locale}=useI18n();
  const [user,setUser]=useState<any>(null);const [profile,setProfile]=useState<any>(null);const [membership,setMembership]=useState<any>(null);const [payment,setPayment]=useState<any>(null);const [loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{const s=createClient();const {data:{user}}=await s.auth.getUser();if(!user){window.location.href="/login";return;}setUser(user);const [{data:profile},{data:membership},{data:payments}]=await Promise.all([
    s.from("profiles").select("full_name,role").eq("id",user.id).maybeSingle(),
    s.from("memberships").select("starts_at,ends_at,status").eq("user_id",user.id).eq("status","active").gt("ends_at",new Date().toISOString()).order("ends_at",{ascending:false}).limit(1).maybeSingle(),
    s.from("payment_requests").select("status,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(1).maybeSingle()
  ]);setProfile(profile);setMembership(membership);setPayment(payments);setLoading(false);})();},[]);
  async function logout(){await createClient().auth.signOut();window.location.href="/";}
  if(loading)return <main className="container py-20 muted">...</main>;
  const active=!!membership;
  const paymentStatus=payment?.status==="pending"?t("pending"):payment?.status==="approved"?t("approved"):payment?.status==="rejected"?t("rejected"):t("none");
  return <main className="container min-h-screen py-8"><header className="flex flex-wrap items-center justify-between gap-4 pr-20"><Link href="/" className="text-xl font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><div className="flex items-center gap-3"><span className="muted text-sm">{profile?.full_name||user?.email}</span><button onClick={logout} className="btn btn-secondary">{t("logout")}</button></div></header><section className="mt-12"><p className="muted text-sm">{t("studentSpace")}</p><h1 className="mt-2 text-3xl font-bold">{locale==="fr"?"Bonjour":"Hola"}{profile?.full_name?" "+profile.full_name:""} 👋</h1><p className="muted mt-2">{t("welcome")}</p></section><section className="mt-8 grid gap-5 md:grid-cols-3"><div className="panel p-6 md:col-span-2"><p className="muted text-sm">{t("accessStatus")}</p><h2 className="mt-3 text-2xl font-bold">{active?t("activeMember"):t("notActivated")}</h2>{active?<p className="muted mt-2 text-sm">{t("expires")} {new Date(membership.ends_at).toLocaleString(locale==="fr"?"fr-FR":"es-MX")}</p>:<p className="muted mt-2 text-sm">{t("approvalInfo")}</p>}<Link className="btn mt-6" href="/membership">{active?t("viewPlan"):t("requestAccess")}</Link></div><div className="panel p-6"><p className="muted text-sm">{t("latestRequest")}</p><h2 className="mt-3 text-xl font-bold">{paymentStatus}</h2><p className="muted mt-2 text-sm">{t("paymentLine")}</p></div></section><section className="mt-8 grid gap-4 md:grid-cols-3">{[[t("myCourses"),"/courses",t("courseDescription")],[t("zoomClasses"),"/classes",t("zoomDescription")],[t("myAccess"),"/membership",t("accessDescription")]].map(([title,url,desc])=><Link key={url} href={url} className="panel p-6 transition hover:border-amber-400"><h3 className="font-bold">{title}</h3><p className="muted mt-2 text-sm">{desc}</p></Link>)}</section></main>;
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {useI18n} from "@/components/i18n-provider";

export default function RegisterPage() {
  const {t}=useI18n();
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [info,setInfo]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");setInfo("");const {data,error}=await createClient().auth.signUp({email,password,options:{data:{full_name:name}}});setBusy(false);if(error){setError(error.message);return;}if(data.session){router.push("/dashboard");router.refresh();}else{setInfo(t("confirmEmail"));}}
  return <main className="container flex min-h-screen items-center justify-center py-12"><form onSubmit={submit} className="panel w-full max-w-md p-8"><Link href="/" className="font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><h1 className="mt-8 text-3xl font-bold">{t("registerTitle")}</h1><p className="muted mt-2 text-sm">{t("registerIntro")}</p><label className="mt-6 block text-sm">{t("fullName")}<input className="field mt-2" required value={name} onChange={e=>setName(e.target.value)}/></label><label className="mt-4 block text-sm">{t("email")}<input className="field mt-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="mt-4 block text-sm">{t("password")}<input className="field mt-2" type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="mt-4 text-sm text-red-400">{error}</p>}{info&&<p className="mt-4 text-sm text-emerald-400">{info}</p>}<button disabled={busy} className="btn mt-6 w-full">{busy?t("creatingAccount"):t("createMyAccount")}</button><p className="muted mt-5 text-sm">{t("alreadyRegistered")} <Link className="underline" href="/login">{t("login")}</Link></p></form></main>;
}

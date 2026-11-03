"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import {useI18n} from "@/components/i18n-provider";

export default function LoginPage() {
  const {t}=useI18n();
  const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");const {error}=await createClient().auth.signInWithPassword({email,password});setBusy(false);if(error){setError(error.message);return;}router.push("/dashboard");router.refresh();}
  return <main className="container flex min-h-screen items-center justify-center py-12"><form onSubmit={submit} className="panel w-full max-w-md p-8"><Link href="/" className="font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><h1 className="mt-8 text-3xl font-bold">{t("connection")}</h1><p className="muted mt-2 text-sm">{t("accessStudent")}</p><label className="mt-6 block text-sm">{t("email")}<input className="field mt-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="mt-4 block text-sm">{t("password")}<input className="field mt-2" type="password" required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="mt-4 text-sm text-red-400">{error}</p>}<p className="mt-4 text-right text-xs"><Link className="underline muted" href="/forgot-password">Mot de passe oublié / ¿Olvidaste tu contraseña?</Link></p><button disabled={busy} className="btn mt-6 w-full">{busy?t("signingIn"):t("login")}</button><p className="muted mt-5 text-sm">{t("noAccount")} <Link className="underline" href="/register">{t("createAccount")}</Link></p></form></main>;
}

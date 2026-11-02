"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";

export default function RegisterPage() {
  const [name,setName]=useState(""); const [email,setEmail]=useState(""); const [password,setPassword]=useState("");
  const [error,setError]=useState(""); const [info,setInfo]=useState(""); const [busy,setBusy]=useState(false); const router=useRouter();
  async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setError("");setInfo("");const {data,error}=await createClient().auth.signUp({email,password,options:{data:{full_name:name}}});setBusy(false);if(error){setError(error.message);return;}if(data.session){router.push("/dashboard");router.refresh();}else{setInfo("Compte créé. Vérifie ton e-mail pour confirmer l'inscription, puis connecte-toi.");}}
  return <main className="container flex min-h-screen items-center justify-center py-12"><form onSubmit={submit} className="panel w-full max-w-md p-8"><Link href="/" className="font-black">CLASSE<span style={{color:"#d7a84b"}}>TRADING</span></Link><h1 className="mt-8 text-3xl font-bold">Créer un compte</h1><p className="muted mt-2 text-sm">Inscris-toi avant de demander ton accès à la formation.</p><label className="mt-6 block text-sm">Nom complet<input className="field mt-2" required value={name} onChange={e=>setName(e.target.value)}/></label><label className="mt-4 block text-sm">E-mail<input className="field mt-2" type="email" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label className="mt-4 block text-sm">Mot de passe<input className="field mt-2" type="password" minLength={8} required value={password} onChange={e=>setPassword(e.target.value)}/></label>{error&&<p className="mt-4 text-sm text-red-400">{error}</p>}{info&&<p className="mt-4 text-sm text-emerald-400">{info}</p>}<button disabled={busy} className="btn mt-6 w-full">{busy?"Création...":"Créer mon compte"}</button><p className="muted mt-5 text-sm">Déjà inscrit ? <Link className="underline" href="/login">Se connecter</Link></p></form></main>;
}

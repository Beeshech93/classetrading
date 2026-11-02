import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import PaymentActions from "./actions";
export default async function AdminPaymentsPage(){
 const supabase=createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login");
 const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="admin")redirect("/dashboard");
 const {data:requests,error}=await supabase.from("payment_requests").select("id,user_id,amount_cents,currency,payment_method,payment_reference,status,created_at,profiles(full_name)").eq("status","pending").order("created_at",{ascending:true});
 return <main className="container min-h-screen py-10"><Link href="/admin" className="muted text-sm">← Administration</Link><h1 className="mt-6 text-3xl font-bold">Paiements à vérifier</h1><p className="muted mt-2 text-sm">Vérifie la réception effective des fonds avant toute approbation.</p>{error&&<p className="mt-5 text-sm text-red-400">{error.message}</p>}<div className="mt-8 space-y-4">{requests?.map((p:any)=><article className="panel p-6" key={p.id}><div className="flex flex-wrap justify-between gap-2"><div><h2 className="font-bold">{p.profiles?.full_name||"Étudiant"}</h2><p className="muted mt-1 text-xs">{p.user_id}</p></div><strong>$ {(p.amount_cents/100).toFixed(2)} {p.currency}</strong></div><p className="mt-4 text-sm">Méthode : {p.payment_method}</p><p className="muted mt-1 text-sm">Référence : {p.payment_reference||"Non fournie"}</p><p className="muted mt-1 text-xs">Soumis le {new Date(p.created_at).toLocaleString("fr-FR")}</p><PaymentActions id={p.id}/></article>)}</div>{!requests?.length&&!error&&<p className="muted mt-5">Aucune demande en attente.</p>}</main>;
}

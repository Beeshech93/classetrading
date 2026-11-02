"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
export default function PaymentActions({id}:{id:string}){
 const [busy,setBusy]=useState(false);const [error,setError]=useState("");const router=useRouter();
 async function review(approve:boolean){setBusy(true);setError("");const supabase=createClient();const result=approve?await supabase.rpc("admin_approve_payment_request",{p_payment_request_id:id}):await supabase.rpc("admin_reject_payment_request",{p_payment_request_id:id,p_reason:"Payment not verified"});setBusy(false);if(result.error){setError(result.error.message);return;}router.refresh();}
 return <div className="mt-3 flex flex-wrap items-center gap-2"><button disabled={busy} onClick={()=>review(true)} className="btn">{busy?"...":"Approuver · 30 jours"}</button><button disabled={busy} onClick={()=>review(false)} className="btn btn-secondary">Refuser</button>{error&&<p className="w-full text-xs text-red-400">{error}</p>}</div>;
}

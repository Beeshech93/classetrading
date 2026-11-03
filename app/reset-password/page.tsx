"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { useI18n } from "@/components/i18n-provider";

export default function ResetPasswordPage() {
  const { locale } = useI18n();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const fr = locale === "fr";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirmation) {
      setError(fr ? "Les mots de passe ne correspondent pas." : "Las contraseñas no coinciden.");
      return;
    }
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSaved(true);
    window.setTimeout(() => router.replace("/dashboard"), 1200);
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <form onSubmit={submit} className="panel w-full max-w-md p-8">
        <Link href="/" className="font-black">CLASSE<span style={{ color: "#d7a84b" }}>TRADING</span></Link>
        <h1 className="mt-8 text-3xl font-bold">{fr ? "Créer un nouveau mot de passe" : "Crear una contraseña nueva"}</h1>
        {saved ? (
          <p role="status" className="mt-6 text-sm text-emerald-300">{fr ? "Mot de passe mis à jour. Redirection..." : "Contraseña actualizada. Redirigiendo..."}</p>
        ) : (
          <>
            <label className="mt-6 block text-sm">{fr ? "Nouveau mot de passe" : "Nueva contraseña"}
              <input className="field mt-2" type="password" minLength={8} required autoComplete="new-password" value={password} onChange={event => setPassword(event.target.value)} />
            </label>
            <label className="mt-4 block text-sm">{fr ? "Confirmer le mot de passe" : "Confirmar contraseña"}
              <input className="field mt-2" type="password" minLength={8} required autoComplete="new-password" value={confirmation} onChange={event => setConfirmation(event.target.value)} />
            </label>
            {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
            <button disabled={busy} className="btn mt-6 w-full">{busy ? (fr ? "Enregistrement..." : "Guardando...") : (fr ? "Enregistrer le mot de passe" : "Guardar contraseña")}</button>
          </>
        )}
        <p className="muted mt-5 text-sm"><Link className="underline" href="/login">{fr ? "Retour à la connexion" : "Volver al inicio de sesión"}</Link></p>
      </form>
    </main>
  );
}

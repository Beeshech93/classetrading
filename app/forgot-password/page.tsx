"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/browser";
import { useI18n } from "@/components/i18n-provider";

export default function ForgotPasswordPage() {
  const { locale } = useI18n();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const fr = locale === "fr";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const redirectTo = `${window.location.origin}/reset-password`;
    const { error } = await createClient().auth.resetPasswordForEmail(email.trim(), { redirectTo });
    setBusy(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  return (
    <main className="container flex min-h-screen items-center justify-center py-12">
      <form onSubmit={submit} className="panel w-full max-w-md p-8">
        <Link href="/" className="font-black">CLASSE<span style={{ color: "#d7a84b" }}>TRADING</span></Link>
        <h1 className="mt-8 text-3xl font-bold">{fr ? "Mot de passe oublié" : "¿Olvidaste tu contraseña?"}</h1>
        <p className="muted mt-2 text-sm">{fr ? "Nous t'enverrons un lien sécurisé pour choisir un nouveau mot de passe." : "Te enviaremos un enlace seguro para crear una contraseña nueva."}</p>
        {sent ? (
          <p role="status" className="mt-6 text-sm text-emerald-300">{fr ? "Si cette adresse est enregistrée, tu recevras un e-mail de réinitialisation." : "Si este correo está registrado, recibirás un mensaje para restablecer la contraseña."}</p>
        ) : (
          <>
            <label className="mt-6 block text-sm">{fr ? "E-mail" : "Correo electrónico"}
              <input className="field mt-2" type="email" required autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} />
            </label>
            {error && <p role="alert" className="mt-4 text-sm text-red-400">{error}</p>}
            <button disabled={busy} className="btn mt-6 w-full">{busy ? (fr ? "Envoi..." : "Enviando...") : (fr ? "Envoyer le lien" : "Enviar enlace")}</button>
          </>
        )}
        <p className="muted mt-5 text-sm"><Link className="underline" href="/login">{fr ? "Retour à la connexion" : "Volver al inicio de sesión"}</Link></p>
      </form>
    </main>
  );
}

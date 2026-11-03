"use client";

import {createContext,useContext,useEffect,useMemo,useState} from "react";

type Locale = "fr" | "es";
type Dictionary = Record<string,string>;
const messages: Record<Locale,Dictionary> = {
  fr: {
    language:"Langue",login:"Se connecter",join:"Rejoindre",academy:"L'académie de trading",
    hero1:"Apprends à lire les marchés.",hero2:"Construis ta méthode.",
    intro:"Une formation structurée en Forex, XAUUSD et analyse des marchés, avec cours, ressources et sessions en direct sur Zoom.",
    access:"Accéder à l'académie",student:"Espace étudiant",risk:"Formation éducative. Le trading comporte un risque de perte en capital.",
    membership:"MEMBERSHIP · 30 JOURS",oneTime:"Paiement unique · Pas de renouvellement automatique",
    courses:"Cours structurés et leçons",zoom:"Sessions en direct sur Zoom",replays:"Replays et supports pédagogiques",analysis:"Analyses Forex et XAUUSD",community:"Communauté privée des étudiants",
    signupPrice:"S'inscrire pour 200 $",progressive:"Formation progressive",sessions:"Sessions Zoom",support:"Suivi pédagogique",
    progressiveText:"Des modules et leçons pour développer une méthode d'analyse.",sessionsText:"Un calendrier de sessions en direct et des replays accessibles aux membres actifs.",supportText:"Un espace personnel pour suivre les cours et la durée de son accès.",
    terms:"Conditions",privacy:"Confidentialité",riskLink:"Risques du trading",connection:"Connexion",accessStudent:"Accède à ton espace étudiant.",
    email:"E-mail",password:"Mot de passe",noAccount:"Pas encore de compte ?",createAccount:"Créer un compte",signingIn:"Connexion...",
    creatingAccount:"Création...",createMyAccount:"Créer mon compte",fullName:"Nom complet",registerTitle:"Créer un compte",
    registerIntro:"Inscris-toi avant de demander ton accès à la formation.",alreadyRegistered:"Déjà inscrit ?",confirmEmail:"Compte créé. Vérifie ton e-mail pour confirmer l'inscription, puis connecte-toi.",
    dashboard:"Tableau de bord",studentSpace:"ESPACE ÉTUDIANT",welcome:"Bienvenue dans ton espace ClasseTrading.",
    accessStatus:"STATUT DE TON ACCÈS",activeMember:"Membre actif",notActivated:"Accès non activé",
    expires:"Fin d'accès :",approvalInfo:"L'accès aux cours sera activé après vérification manuelle de ton paiement de 200 USD.",
    viewPlan:"Voir ma formule",requestAccess:"Demander mon accès",latestRequest:"DERNIÈRE DEMANDE",
    pending:"En attente",approved:"Approuvée",rejected:"Refusée",none:"Aucune",paymentLine:"Paiement unique · 200 USD · 30 jours",
    myCourses:"Mes cours",courseDescription:"Accède aux modules de formation.",zoomClasses:"Classes Zoom",
    zoomDescription:"Consulte le calendrier et les liens de réunion.",myAccess:"Mon accès",
    accessDescription:"Soumets un paiement et suis son statut.",logout:"Déconnexion",
    plan:"FORMULE UNIQUE · 30 JOURS",noRenewal:"Paiement unique. Aucun renouvellement automatique.",
    tradingCourses:"Cours de trading",resources:"Replays et ressources",afterApproval:"Accès pendant 30 jours après approbation",
    submitPayment:"Soumettre un paiement",paymentIntro:"Effectue le paiement, puis joins le justificatif et sa référence.",
    paymentDetails:"Coordonnées de paiement",paymentMethod:"Mode de paiement",reference:"Référence de transaction",
    proof:"Justificatif (JPG, PNG, WebP ou PDF · 5 Mo max)",sendReview:"Envoyer pour vérification",
    sending:"Envoi...",noImmediateAccess:"La demande ne donne pas immédiatement accès aux cours.",
    history:"Historique de mes demandes",noRequests:"Aucune demande pour le moment.",proofAttached:"Justificatif joint",
    requestSent:"Demande envoyée. L'administration vérifiera le paiement avant d'activer ton accès.",
    backDashboard:"← Tableau de bord",bankTransfer:"Virement bancaire",other:"Autre"
  },
  es: {
    language:"Idioma",login:"Iniciar sesión",join:"Registrarme",academy:"La academia de trading",
    hero1:"Aprende a leer los mercados.",hero2:"Construye tu método.",
    intro:"Formación estructurada en Forex, XAUUSD y análisis de mercados, con cursos, recursos y sesiones en vivo por Zoom.",
    access:"Acceder a la academia",student:"Área de estudiantes",risk:"Formación educativa. El trading implica riesgo de pérdida de capital.",
    membership:"MEMBRESÍA · 30 DÍAS",oneTime:"Pago único · Sin renovación automática",
    courses:"Cursos estructurados y lecciones",zoom:"Sesiones en vivo por Zoom",replays:"Grabaciones y material educativo",analysis:"Análisis de Forex y XAUUSD",community:"Comunidad privada de estudiantes",
    signupPrice:"Inscribirme por $200",progressive:"Formación progresiva",sessions:"Sesiones por Zoom",support:"Seguimiento educativo",
    progressiveText:"Módulos y lecciones para desarrollar un método de análisis.",sessionsText:"Calendario de sesiones en vivo y grabaciones para miembros activos.",supportText:"Un espacio personal para seguir los cursos y la duración de tu acceso.",
    terms:"Términos",privacy:"Privacidad",riskLink:"Riesgos del trading",connection:"Iniciar sesión",accessStudent:"Accede a tu espacio de estudiante.",
    email:"Correo electrónico",password:"Contraseña",noAccount:"¿Todavía no tienes cuenta?",createAccount:"Crear una cuenta",signingIn:"Ingresando...",
    creatingAccount:"Creando...",createMyAccount:"Crear mi cuenta",fullName:"Nombre completo",registerTitle:"Crear una cuenta",
    registerIntro:"Regístrate antes de solicitar acceso a la formación.",alreadyRegistered:"¿Ya tienes una cuenta?",confirmEmail:"Cuenta creada. Revisa tu correo para confirmar el registro y luego inicia sesión.",
    dashboard:"Panel",studentSpace:"ÁREA DEL ESTUDIANTE",welcome:"Bienvenido a tu espacio de ClasseTrading.",
    accessStatus:"ESTADO DE TU ACCESO",activeMember:"Membresía activa",notActivated:"Acceso no activado",
    expires:"Acceso hasta:",approvalInfo:"El acceso a los cursos se activará después de verificar manualmente tu pago de 200 USD.",
    viewPlan:"Ver mi plan",requestAccess:"Solicitar acceso",latestRequest:"ÚLTIMA SOLICITUD",
    pending:"Pendiente",approved:"Aprobado",rejected:"Rechazado",none:"Ninguna",paymentLine:"Pago único · 200 USD · 30 días",
    myCourses:"Mis cursos",courseDescription:"Accede a los módulos de formación.",zoomClasses:"Clases por Zoom",
    zoomDescription:"Consulta el calendario y los enlaces de las sesiones.",myAccess:"Mi acceso",
    accessDescription:"Envía un pago y consulta su estado.",logout:"Cerrar sesión",
    plan:"PLAN ÚNICO · 30 DÍAS",noRenewal:"Pago único. Sin renovación automática.",
    tradingCourses:"Cursos de trading",resources:"Grabaciones y recursos",afterApproval:"Acceso durante 30 días tras la aprobación",
    submitPayment:"Enviar un pago",paymentIntro:"Realiza el pago y adjunta el comprobante y su referencia.",
    paymentDetails:"Datos de pago",paymentMethod:"Método de pago",reference:"Referencia de la transacción",
    proof:"Comprobante (JPG, PNG, WebP o PDF · máximo 5 MB)",sendReview:"Enviar para verificación",
    sending:"Enviando...",noImmediateAccess:"La solicitud no activa el acceso inmediato a los cursos.",
    history:"Historial de mis solicitudes",noRequests:"Todavía no hay solicitudes.",proofAttached:"Comprobante adjunto",
    requestSent:"Solicitud enviada. La administración verificará el pago antes de activar tu acceso.",
    backDashboard:"← Panel",bankTransfer:"Transferencia bancaria",other:"Otro"
  }
};

const I18nContext=createContext<{locale:Locale; t:(key:string)=>string; setLocale:(locale:Locale)=>void}>({
  locale:"fr",t:(key)=>messages.fr[key]||key,setLocale:()=>{}
});

export function I18nProvider({children}:{children:React.ReactNode}) {
  const [locale,setLocaleState]=useState<Locale>("fr");
  useEffect(()=>{
    const saved=window.localStorage.getItem("classetrading-locale");
    if(saved==="fr"||saved==="es")setLocaleState(saved);
  },[]);
  useEffect(()=>{
    document.documentElement.lang=locale;
    window.localStorage.setItem("classetrading-locale",locale);
  },[locale]);
  const value=useMemo(()=>({locale,t:(key:string)=>messages[locale][key]||messages.fr[key]||key,setLocale:setLocaleState}),[locale]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
export function useI18n(){return useContext(I18nContext);}
export function LanguageSwitcher(){
  const {locale,setLocale}=useI18n();
  return <div aria-label="Language selector" className="fixed right-4 top-4 z-50 flex items-center gap-1 rounded-full border border-slate-600 bg-slate-950/95 p-1 shadow-lg">
    <button type="button" onClick={()=>setLocale("fr")} aria-pressed={locale==="fr"} className={`rounded-full px-3 py-1.5 text-xs font-bold ${locale==="fr"?"bg-amber-400 text-slate-950":"text-slate-200"}`}>FR</button>
    <button type="button" onClick={()=>setLocale("es")} aria-pressed={locale==="es"} className={`rounded-full px-3 py-1.5 text-xs font-bold ${locale==="es"?"bg-amber-400 text-slate-950":"text-slate-200"}`}>ES</button>
  </div>;
}

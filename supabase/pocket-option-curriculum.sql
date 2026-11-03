-- Starter curriculum for ClasseTrading's Pocket Option practical classes.
-- Run once in Supabase SQL Editor after schema.sql and security-hardening.sql.
-- Safe to re-run: courses are matched by slug and lessons by course + title.
do $$
declare
  c_id uuid;
begin
  insert into public.courses (title, slug, description, is_published, sort_order)
  values ('Fondamentaux de Pocket Option', 'pocket-option-fondamentaux',
    'Découvrir l’interface, les ordres, les graphiques et les limites du produit avant toute pratique.',
    true, 10)
  on conflict (slug) do update set description = excluded.description
  returning id into c_id;

  insert into public.lessons (course_id,title,description,content,is_published,sort_order)
  select c_id, v.title, v.description, v.content, true, v.position
  from (values
    (1,'Découvrir l’interface','Repérer les éléments essentiels de la plateforme.',
     'Objectifs : identifier le graphique, l’actif affiché, la période, les outils graphiques et le panneau d’ordre.\n\nExercice : navigue dans l’interface en mode démo et note le rôle de chaque zone. Ne dépose pas d’argent réel pour apprendre à utiliser les menus.'),
    (2,'Comprendre les ordres et les échéances','Comprendre le fonctionnement général des opérations à durée déterminée.',
     'Étudie la différence entre durée d’expiration, montant engagé et résultat affiché. Lis les conditions du produit et les règles de la plateforme dans ton pays.\n\nÀ retenir : une prévision correcte n’est pas garantie et une opération peut entraîner la perte du montant engagé.'),
    (3,'Graphiques et temporalités','Lire un graphique sans confondre les unités de temps.',
     'Une bougie représente les mouvements de prix sur une période donnée. Compare plusieurs temporalités et observe comment le même mouvement peut sembler différent selon l’échelle.\n\nExercice : observe le même actif sur 1 min, 5 min et 15 min en mode démo.')
  ) as v(position,title,description,content)
  where not exists (select 1 from public.lessons l where l.course_id=c_id and l.title=v.title);

  insert into public.courses (title, slug, description, is_published, sort_order)
  values ('Lecture des chandeliers et du marché', 'chandeliers-et-marche',
    'Lire la structure des bougies, les tendances et les zones techniques avec méthode.',
    true, 20)
  on conflict (slug) do update set description = excluded.description
  returning id into c_id;

  insert into public.lessons (course_id,title,description,content,is_published,sort_order)
  select c_id, v.title, v.description, v.content, true, v.position
  from (values
    (1,'Anatomie d’une bougie','Ouverture, clôture, plus haut, plus bas et mèches.',
     'Une bougie présente quatre informations : ouverture, clôture, plus haut et plus bas. Le corps montre l’écart entre ouverture et clôture ; les mèches indiquent les extrêmes atteints pendant la période.\n\nExercice : repère 20 bougies et classe-les selon leur corps et leurs mèches. Évite d’interpréter une bougie isolée comme un signal certain.'),
    (2,'Tendance et structure','Identifier sommets et creux successifs.',
     'Une tendance haussière présente généralement des sommets et creux ascendants ; une tendance baissière présente généralement des sommets et creux descendants. Un marché latéral évolue dans une zone.\n\nExercice : annote des graphiques historiques et indique les zones où ton interprétation devient incertaine.'),
    (3,'Supports et résistances','Tracer des zones plutôt que des lignes prétendument exactes.',
     'Les supports et résistances sont des zones d’intérêt observées sur l’historique. Elles peuvent céder, être traversées ou devenir moins pertinentes.\n\nExercice : trace deux ou trois zones sur un graphique historique, puis vérifie leur comportement sans engager de capital.')
  ) as v(position,title,description,content)
  where not exists (select 1 from public.lessons l where l.course_id=c_id and l.title=v.title);

  insert into public.courses (title, slug, description, is_published, sort_order)
  values ('Indicateurs et confirmation', 'indicateurs-confirmation',
    'Utiliser les indicateurs comme outils descriptifs, sans les traiter comme des prédicteurs infaillibles.',
    true, 30)
  on conflict (slug) do update set description = excluded.description
  returning id into c_id;

  insert into public.lessons (course_id,title,description,content,is_published,sort_order)
  select c_id, v.title, v.description, v.content, true, v.position
  from (values
    (1,'Moyennes mobiles','Comprendre la tendance moyenne et le retard des indicateurs.',
     'Une moyenne mobile lisse les prix passés. Elle réagit avec retard et ne prédit pas à elle seule la prochaine variation. Compare différentes périodes et observe les faux signaux en marché latéral.'),
    (2,'RSI et momentum','Lire une mesure de momentum et ses limites.',
     'Le RSI mesure la vitesse et l’ampleur des variations récentes. Les zones souvent appelées surachat ou survente ne signifient pas qu’un retournement est imminent. Observe le contexte et les divergences sans en faire une certitude.'),
    (3,'Construire une confirmation','Combiner contexte, structure et indicateurs.',
     'Écris une règle d’observation claire : contexte de tendance, zone technique, condition de confirmation et condition qui invalide ton scénario. Teste-la sur un échantillon historique suffisamment large avant toute conclusion.')
  ) as v(position,title,description,content)
  where not exists (select 1 from public.lessons l where l.course_id=c_id and l.title=v.title);

  insert into public.courses (title, slug, description, is_published, sort_order)
  values ('Gestion du risque et pratique disciplinée', 'risque-et-discipline',
    'Apprendre à limiter l’exposition, tenir un journal et pratiquer en compte démo.',
    true, 40)
  on conflict (slug) do update set description = excluded.description
  returning id into c_id;

  insert into public.lessons (course_id,title,description,content,is_published,sort_order)
  select c_id, v.title, v.description, v.content, true, v.position
  from (values
    (1,'Risque et perte possible','Comprendre que le capital engagé peut être perdu.',
     'Définis à l’avance une limite de perte que tu peux supporter. N’emprunte pas pour trader, ne poursuis pas les pertes et ne considère jamais un revenu comme garanti. Les produits à échéance courte et les options binaires sont particulièrement risqués.'),
    (2,'Journal de pratique','Documenter les observations et les erreurs.',
     'Pour chaque exercice, note : date, actif, temporalité, contexte, hypothèse, règle suivie, résultat observé et leçon retenue. Évalue la qualité du processus, pas seulement le résultat d’une opération.'),
    (3,'Plan de pratique en compte démo','Tester une méthode sans argent réel.',
     'Définis une période d’observation, un ensemble de règles et un nombre suffisant d’exemples. N’augmente pas ton exposition pour récupérer une perte. Si tu ne peux pas expliquer pourquoi une configuration est invalide, ne la traite pas comme un signal.')
  ) as v(position,title,description,content)
  where not exists (select 1 from public.lessons l where l.course_id=c_id and l.title=v.title);
end $$;

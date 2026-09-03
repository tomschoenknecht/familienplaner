-- Aufrufzähler für zettelini.de
-- Einmalig im Supabase SQL Editor ausführen. Danach nur noch die Auswertungen unten.
--
-- Bewusst getrennt von familienplaner_data: Der Zähler hat mit den Familiendaten
-- nichts zu tun und darf sie auch im Fehlerfall nicht berühren.

-- ---------------------------------------------------------------------------
-- 1. Tabelle
-- ---------------------------------------------------------------------------

create table if not exists public.aufrufe (
  id         bigserial primary key,
  ts         timestamptz not null default now(),
  pfad       text not null check (length(pfad) <= 120),
  ref_domain text          check (length(ref_domain) <= 80),
  via        text          check (length(via) <= 40)
);

-- Die Längengrenzen sind die Bremse gegen Müll: Wer die Tabelle mit dem
-- öffentlichen Anon-Schlüssel vollschreiben wollte, kann keine großen
-- Nutzlasten unterbringen.

create index if not exists aufrufe_ts_idx   on public.aufrufe (ts desc);
create index if not exists aufrufe_via_idx  on public.aufrufe (via) where via is not null;

-- ---------------------------------------------------------------------------
-- 2. Row Level Security: schreiben ja, lesen nein
-- ---------------------------------------------------------------------------

alter table public.aufrufe enable row level security;

drop policy if exists "anon darf zaehlen" on public.aufrufe;
create policy "anon darf zaehlen"
  on public.aufrufe for insert
  to anon
  with check (true);

-- Absichtlich KEINE select-Policy. Damit kann niemand mit dem öffentlichen
-- Schlüssel die Zahlen auslesen – auch niemand, der den Quelltext liest.
-- Im SQL Editor des Dashboards arbeitest du als Eigentümer und siehst alles.

-- ---------------------------------------------------------------------------
-- 3. Auswertungen
-- ---------------------------------------------------------------------------

-- 3a) Aufrufe pro Tag, letzte 30 Tage
select
  date_trunc('day', ts at time zone 'Europe/Berlin')::date as tag,
  count(*)                                                  as aufrufe
from public.aufrufe
where ts > now() - interval '30 days'
group by 1
order by 1 desc;

-- 3b) Woher kommen sie? Kampagnenwert und Verweis-Domain, letzte 30 Tage
--     "via" ist der Wert aus ?via= in der Adresse (Instagram sendet oft keinen Verweis),
--     "von-start" und "von-ratgeber" markieren den Weg innerhalb der eigenen Seite.
select
  coalesce(via, '(kein Kampagnenwert)')        as kampagne,
  coalesce(ref_domain, '(kein Verweis)')       as verweis,
  count(*)                                     as aufrufe,
  min(ts at time zone 'Europe/Berlin')::date   as erstmals,
  max(ts at time zone 'Europe/Berlin')::date   as zuletzt
from public.aufrufe
where ts > now() - interval '30 days'
group by 1, 2
order by aufrufe desc;

-- 3c) Startseite, Planer und Ratgeber im Verhältnis, letzte 30 Tage
select
  case
    when pfad = '/'                    then '1 Startseite'
    when pfad like '/app%'             then '2 Planer'
    when pfad = '/ratgeber/'           then '3 Ratgeber-Übersicht'
    when pfad like '/ratgeber/%'       then '4 ' || pfad
    else '5 ' || pfad
  end                                  as bereich,
  count(*)                             as aufrufe,
  round(100.0 * count(*) / sum(count(*)) over (), 1) as anteil_prozent
from public.aufrufe
where ts > now() - interval '30 days'
group by 1
order by 1;

-- 3d) Kam nach einem Instagram-Kommentar jemand? Aufrufe je Tag und Kampagnenwert
select
  date_trunc('day', ts at time zone 'Europe/Berlin')::date as tag,
  via,
  count(*) as aufrufe
from public.aufrufe
where via is not null
  and ts > now() - interval '30 days'
group by 1, 2
order by 1 desc, aufrufe desc;

-- ---------------------------------------------------------------------------
-- 4. Aufräumen
-- ---------------------------------------------------------------------------

-- Gelegentlich ausführen. Hält die Tabelle klein und begrenzt den Schaden,
-- falls jemand den öffentlichen Schlüssel missbraucht: Die Datenbank teilt sich
-- den Speicher mit den Familiendaten, ein vollgeschriebener Zähler würde also
-- auch die Synchronisation treffen.
delete from public.aufrufe where ts < now() - interval '6 months';

-- Zur Kontrolle: Wie groß ist die Tabelle inzwischen?
select
  count(*)                                                   as zeilen,
  pg_size_pretty(pg_total_relation_size('public.aufrufe'))   as belegt,
  min(ts)::date                                              as aeltester_eintrag
from public.aufrufe;

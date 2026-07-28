# CLAUDE.md — Pro Natura GmbH Website

Diese Datei ist meine (Claudes) Notiz an mein zukünftiges Ich. Sie erklärt, **wofür**
diese Website ist, **was** sie enthält und **was noch zu tun** ist.

---

## 1. Worum geht es? (Kontext)

Wir bauen die neue Website für **Pro Natura Gesellschaft für gesunde Ernährung mbH**.
Die alte Website (`https://www.pro-natura-gmbh.de`) ist inhaltlich okay, aber optisch
veraltet und unübersichtlich. Ziel dieses Projekts: eine **deutlich schönere, moderne,
schnelle und vertrauenswürdige** Website, die denselben Inhalt hat, aber professionell
aussieht.

> Wichtig: Auftraggeber ist die Familie (der Vater des Nutzers leitet das Unternehmen).
> Ton: seriös, gesundheitsnah, vertrauensbildend, „Apotheken-Qualität" – aber modern.

### Das Unternehmen in einem Satz
Pro Natura entwickelt seit **1994** in Bad Vilbel innovative **Enzympräparate und
Nahrungsergänzungsmittel**, mit denen Menschen mit **Nahrungsmittel­unverträglichkeiten**
(Laktose, Fructose, Oligosaccharide) wieder unbeschwert essen können.

### Eckdaten (für Inhalte / Impressum)
- **Firma:** Pro Natura Gesellschaft für gesunde Ernährung mbH
- **Adresse:** Konrad-Adenauer-Allee 8–10, 61118 Bad Vilbel, Deutschland
- **Telefon:** +49 (0)6101 80272910
- **Telefax:** +49 (0)6101 80272963
- **E-Mail:** info@pro-natura-gmbh.de (Produktanfragen historisch auch info@oligase.de)
- **Registergericht:** Amtsgericht Frankfurt am Main, HRB 39401
- **Gegründet:** 1994
- ⚠️ Geschäftsführer, USt-IdNr. und genaue Registerdaten sind **noch zu verifizieren**
  (Platzhalter im Impressum prüfen, siehe „Offene Punkte").

---

## 2. Die Produkte (das Herz der Seite)

| Produkt | Wofür | Wirkstoff / Mechanik | Hinweise |
|---|---|---|---|
| **Lactrase®** | Laktoseintoleranz | „saure" Laktase, spaltet Milchzucker im Magen in Glucose + Galactose | Nr. 1 Laktasemarke in Apotheken seit 23+ Jahren. Varianten: 3.300 / 6.000 / 12.000 / 18.000 FCC. EFSA-Empfehlung: ≥ 4.500 FCC pro laktosehaltiger Mahlzeit |
| **Fructaid®** | Fructoseintoleranz / Fructosemalabsorption | Glucose-Isomerase wandelt nicht resorbierte Fructose in resorbierbare Glucose um | Seit 2016. 1–4 Kapseln vor fructosehaltigen Speisen, bis 4×/Tag |
| **Oligase® 600** | Blähende Hülsenfrüchte, Gemüse, Getreide (FODMAP-Oligosaccharide) | Alpha-Galactosidase + Saccharase + Cellulase + Hemicellulase spalten Raffinose/Stachyose/Verbascose | 600 GalU/Kapsel. 1–3 Kapseln pro Mahlzeit, max. 15/Tag |

> ⚠️ **Pektinkapseln** wurden aus der Website entfernt – das Produkt wird **nicht mehr verkauft**
> (Stand 2026, Info vom Auftraggeber). Nicht wieder aufnehmen.

**Unternehmenswerte:** Innovation · Qualität · Nachhaltigkeit · natürliche, gesunde Produkte.

---

## 3. Was die Website hat (aktueller Stand des Neubaus)

Tech-Stack bewusst **ohne Build-Schritt** (reines HTML/CSS/JS), weil:
- robust gegen Netzwerk-/Egress-Einschränkungen (kein `npm install` nötig),
- blitzschnell, top für SEO, überall hostbar (jeder Webspace, GitHub Pages, Netlify…),
- für eine Broschüren-/Marketing-Seite völlig ausreichend und wartungsarm.

```
/
├── index.html          # Startseite: Hero → Zu unseren Marken → Unsere Mission → Distributor-CTA → Kontakt
├── ueber-uns.html      # Über uns + Unsere Geschichte (Timeline 1994–2024 + Kennzahlen)
├── lactrase.html       # Produkt-Detailseite Lactrase® (inkl. alle Stärken 1.500–32.000 FCC)
├── fructaid.html       # Produkt-Detailseite Fructaid®
├── oligase.html        # Produkt-Detailseite Oligase® 600
├── impressum.html      # Pflichtangaben (DE) – Platzhalter prüfen!
├── datenschutz.html    # DSGVO-Datenschutzerklärung – Platzhalter prüfen!
├── css/styles.css      # Komplettes Designsystem (Fonts, Tokens, Komponenten, Responsive, Strahlen)
├── js/main.js          # Kopfzeile · Navigation (Mobil-Panel + Marken-Dropdown) · Scroll-Reveal
│                       # · Farbaufbruch (Paint-Spill) · Produkt-Strahlen · Formular · Jahr
├── assets/
│   ├── logo-original.png   # Wortmarke „pronatura®" (hochauflösend); im Footer per CSS auf Weiß invertiert
│   ├── favicon-32/180/192.png  # Favicons (Original)
│   ├── og-image.png        # Social-Preview 1200×630 (aus Logo + Hero-Composite gerendert)
│   ├── fonts/              # Fraunces + Plus Jakarta Sans als Variable Fonts (woff2, latin/latin-ext,
│   │                       # normal + kursiv) — LOKAL, kein Google-Fonts-Request mehr
│   ├── img/                # hero-products, office, brand-*, lifestyle-* — je Original + .webp
│   └── products/           # Packshots: lactrase.jpg, fructaid.png, oligase.png, lactrase-lineup.png (+ .webp)
├── README.md           # Kurzanleitung (Hosting/Anpassen)
└── CLAUDE.md           # diese Datei
```

> Bilder immer als `<picture>` mit `.webp`-Quelle und Original als Fallback einbinden,
> `width`/`height` gesetzt (kein Layout Shift). Die Originale NICHT löschen.

> Hinweis: **News-Sektion entfernt** (war veraltet, Stand 2024). „Zu unseren Marken" steht
> bewusst VOR „Unsere Mission". Die Firmengeschichte/Timeline liegt auf `ueber-uns.html`.

**🚀 DEPLOYMENT (WICHTIG!):** Die Live-Seite (`arielwyrobnik.github.io`) deployt von Branch
**`claude/clever-faraday-9e5sjw`**. Es gibt KEINEN `main`-Branch. Änderungen NUR sichtbar,
wenn sie auf `clever-faraday` landen (per Merge). Auf `claude/optimistic-pasteur-xgqrhv`
(System-Default) wird ebenfalls committet, dann nach `clever-faraday` gemerged + gepusht.
→ Wenn der Nutzer „ich sehe nichts" sagt: prüfen, ob `clever-faraday` aktuell ist.

**Designsprache:** Struktur an der Original-Website orientiert, sauberer/moderner umgesetzt.
**Bewusst neutrale Basis-Palette** – Anthrazit (`--ink #16191C`) + Grautöne auf Weiß, KEINE
durchgehende Markenfarbe; Buttons/Links anthrazit. Farbe kommt aus den Produktfotos und den
**Produkt-Signaturfarben** (siehe unten). Display-Serif (Fraunces) + Sans (Plus Jakarta
Sans). Bild-getrieben statt Deko-Icons. Hintergrund **weiß**.

**Designsystem = CSS Custom Properties in `:root`.** Alles nur über Tokens, nie Einzelwerte
in Komponenten: Farben (`--ink`, `--ink-body`, `--ink-muted`, `--surface*`, `--line*`),
Typo-Skala (`--fs-display` … `--fs-label`, fluide per `clamp()`), Abstände (`--section-y`,
`--gutter`, `--grid-gap`, `--split-gap`, `--measure`), Radien (`--r-sm…xl`), Schatten
(`--shadow-xs…lg`), Bewegung (`--dur-1…3`, `--ease`), Ebenen (`--z-*`) und `--header-h`
(von JS gepflegt, speist `scroll-padding-top` für Sprungmarken).

**Produkt-Signaturfarben** (aus den echten Verpackungs-Tiles ausgelesen; überall konsistent
verwendet – Marken-Tiles, Distributor-Bänder, Strahlen):
- Lactrase = **Blau `#3AB3E0`** · Oligase = **Dunkelgrün `#407740`** · Fructaid = **Lime `#C1DB5E`**
  (Strahl-Linie Fructaid minimal kräftiger `#B3D24A`, sonst auf Weiß zu blass).
- Für **Text/Buttons** gibt es kontrastgeprüfte `*-ink`-Varianten (WCAG AA, auch auf dem
  eigenen `*-tint`): Lactrase `#0A6AA1`, Oligase `#2F6B3A`, Fructaid `#4A6F14`.
  ⚠️ Fructaid-Ink ist absichtlich dunkler als die Verpackung – `#5E9B1F` fiel auf dem
  Lime-Tint unter 4,5:1 durch.

**Interaktive Effekte (alle in `js/main.js`, neutral/dezent):**
- **Produkt-Strahlen — EIN durchgehender Faden je Produkt**, vom Hero bis ins
  Distributor-Band. Der Faden endet nie im Nichts; unsichtbar ist er nur dort, wo er
  hinter einem deckenden Element durchläuft. Wegführung (`build()` in `js/main.js`):

  1. Hinter dem Packshot hervor, **senkrecht** nach unten – dabei driftet er noch
     innerhalb der Bildspalte zur Zielseite. Der Hero-Text wird nie berührt.
  2. Der **große Schwenk quer über die Seite** liegt in der Mitte hinter dem deckenden
     **Vertrauensband** (`.trust-bar`, `z-index: var(--z-content)`). Genau dafür ist das
     Band da – vorher lief der Schwenk über den Hero-Text.
  3. **Geflochten am zentrierten Abschnittskopf vorbei.** Frei sind nur die Zonen links
     von `head.x` und rechts von `head.right`; dort schwingen die beiden rechten Fäden
     gegenläufig (Phase 0 und π) und kreuzen sich mehrfach.
  4. **Einschlag auf der Marken-Karte** → dort bricht die Farbe auf (siehe unten).
     Der mittlere Faden nimmt den **Spalt zwischen zwei Karten** und trifft seitlich auf;
     sonst entstünde ein flacher Querstrich unter der Überschrift. Er trifft dabei
     fast so weit oben auf wie die anderen (`hitY: 0.18`), damit alle drei Karten
     praktisch **gleichzeitig** aufbrechen – vorher blieb Oligase lange grau.
  5. Hinter der Karte hindurch, dann zusammen durch die **Spalte zwischen Missionsbild
     und Missionstext** (dort erneut geflochten).
  6. **Wieder auffächern**: das Bündel teilt sich auf, jeder Faden läuft in **sein
     eigenes Abteil** des Distributor-Bands und bricht dort auf (siehe unten).

  Technik: ein SVG-Pfad je Faden, weiche Enden über `linearGradient`. Der Zeichen-
  Fortschritt hängt an einer **Ziel-Y-Position im Viewport** (76 % Höhe), nicht an der
  Bogenlänge – dafür gibt es je Pfad eine Nachschlagetabelle Länge↔y. Die Spitze bleibt
  so immer auf Höhe des Lesepunkts und bleibt nirgends stehen. Nur ab **1001 px** Breite.

  ⚠️ **Beim Laden ist noch nichts gezeichnet** (`revealY = yStart`): der Lesepunkt liegt
  bei 76 % Höhe, der Pfad beginnt aber erst unter dem Packshot. Der Vorsprung wird über
  die erste Bildschirmhöhe quadratisch abgebaut. Ohne das war der Faden schon weit
  gelaufen, bevor überhaupt gescrollt wurde. Nicht wieder an `scrollY` allein hängen.

  ⚠️ **Kurvenform:** `toPath()` legt einen **zentripetalen Catmull-Rom-Spline** durch die
  Wegpunkte. Die frühere Variante stellte die Tangente an jedem Wegpunkt senkrecht –
  daraus wurden sichtbare Treppenstufen. `braid()` deckelt die Auslenkung zusätzlich auf
  20 % der Kanallänge und macht nur eine knappe Halbwelle (`1.15π`) je Kanal; mehr wirkt
  hektisch.
  Geometrie gebündelt in `build()`, `update()` schreibt pro Frame nur Styles. Neu gebaut
  bei Resize, Media-Query-Wechsel, `load`, `fonts.ready` und via `ResizeObserver`.

  ⚠️ **Regressionstest:** `tools/raytext.mjs` + `tools/analyze.py` rendern die Seite mit
  magenta, 7 px breiten Strahlen und prüfen pixelweise, dass keine Textbox getroffen wird
  (1001–1728 px). Vor jeder Änderung an der Wegführung erneut laufen lassen.
  Alle Prüfskripte liegen in `tools/` – siehe `tools/README.md`.

- **Farbaufbruch statt Überblendung.** Die Marken-Fotos starten entsättigt
  (`html.paint-on` + `grayscale` auf dem Basisbild). Trifft der Faden auf die Karte,
  bricht die Farbe **von genau diesem Punkt** auf und läuft über die Kachel – wie ein
  umgekippter Farbeimer. Zwei absolut positionierte Ebenen mit `clip-path: circle()`:
  `.brand-card__front` (Signaturfarbe, schnellere Kurve) und `.brand-card__spill` (Klon
  des `<picture>`, etwas langsamer). Der Versatz ergibt den nassen Rand an der Front.
  Ursprung `--sx`/`--sy` setzt JS auf den Einschlagpunkt. Das **Distributor-Band** ist in
  **drei Abteile** geteilt (`.cta-banner__zone`, getrennt von den Wellen des Etiketts);
  jeder Faden taucht in sein eigenes ein und bricht nur dort auf – Lactrase links,
  Oligase Mitte, Fructaid rechts. Der Scrim (`::after`) trägt den weißen Text und läuft
  vom linken Faden aus los.
  ⚠️ Kein gemeinsamer Eintrittspunkt mehr: „alle an einer Seite rein und das ganze Band
  verblasst" war ausdrücklich unerwünscht.
  ⚠️ Kein Fade mehr – „einfach von blass zu bunt" war ausdrücklich unerwünscht.
  ⚠️ Der Farbaufbruch hängt NICHT an der Strahlen-Geometrie: ohne Strahlen (< 1001 px,
  `prefers-reduced-motion`, kein Observer) übernimmt ein `IntersectionObserver` und die
  Farbe bricht aus der Kachelmitte auf. Nicht wieder koppeln – früher blieben die Fotos
  bei reduzierter Bewegung dauerhaft grau.
- **Progressive Enhancement:** `<html>` bekommt per Inline-Skript im `<head>` die Klasse
  `js`. Nur `html.js [data-reveal]` startet unsichtbar – ohne JS ist alles sofort sichtbar.
  Ebenso `html.rays-on` für die Entsättigung.
- **Footer-Welle:** einzelne Wellen-Silhouette (wie Etikett/Original) als Inline-Data-URI
  oben am Footer. (Original-Wave-SVG rendert NICHT als CSS-Background → clipPath/Transforms.)
- **Kopfzeile:** `--header-base` bestimmt das Layout (`min-height`), `--header-h` ist die
  von JS **gemessene** Höhe und speist nur `scroll-padding` und Abstände darunter.
  ⚠️ Die beiden müssen getrennt bleiben. Früher las `min-height` dieselbe Variable, die
  JS aus `offsetHeight` schrieb – bei jedem Neumessen konnte die Kopfzeile dadurch nur
  wachsen (gemessen: 62 → 93 px). Nicht wieder zusammenlegen.
- **Kontaktbereich:** beide Spalten scrollen gleich. Die Datenspalte war `position: sticky`
  und die vier Karten blendeten einzeln ein, während das Formular daneben als Block kam –
  die zwei Hälften liefen beim Scrollen sichtbar auseinander.
- **Kein Hero-Vollbild-Collapse mehr.** Der frühere `100svh`→`is-collapsed`-Effekt hat den
  Packshot auf Tablet/Mobil abgeschnitten und beim ersten Scrollen einen Layout-Sprung
  erzeugt. Der Hero ist jetzt inhaltsgetrieben und ruhig.

> ⚠️ Nutzer-Vorgaben (hart): Neutrale Basis, keine einzelne Farbe die sich durchzieht; Farbe
> nur kontextbezogen aus den Produkten. Kein Blatt/abstrakte Deko. Keine riesigen Icons
> (immer Container + `svg { width/height }`). Professionell, nicht „nach KI". Bei
> Marken-Tiles: Original-Bilder randlos zeigen (kein Beschnitt/keine Naht).

---

## 4. Offene Punkte / TODO (für die Zukunft)

**✅ ERLEDIGT (mehrere Sessions):**
1. **Original-Assets** geladen: Logo (`assets/logo-original.png`, hochauflösend, Footer per
   CSS auf Weiß invertiert), Favicons, echte Produktfotos/Tiles, Hero-Composite, Büro-Foto.
2. **Palette:** zuerst auf Petrol/Teal (Original) umgestellt, dann auf **NEUTRAL** (Anthrazit
   `#1B1E22` + Grau auf Weiß) umgebaut – auf ausdrücklichen Nutzerwunsch („keine Farbe die
   sich durchzieht"). Farbe heute nur kontextbezogen aus den Produkten (siehe Signaturfarben).
   Variablennamen `--forest-*`/`--green-*` historisch beibehalten, Werte = Neutraltöne.
3. **Struktur neu** an Original angelehnt + Produktfokus: Marken-Linkboxen → eigene
   Produkt-Detailseiten; eigene `ueber-uns.html` mit Geschichte/Timeline; News entfernt;
   Reihenfolge Marken → Mission. Lactrase-Detailseite zeigt **alle Stärken** (1.500–32.000 FCC).
4. **Texte** näher ans Original (Hero-Claim „Verträglich. Genussvoll. Gesund.", Mission 1994,
   Produkttexte, „Quelle: IQVIA").
5. **Interaktion** ergänzt: Produkt-Strahlen, Colorize/Fülleffekt, Footer-Welle, farbiger
   Distributor-Banner (siehe Abschnitt 3, „Interaktive Effekte").
6. ⚠️ **Pektinkapseln** weiterhin NICHT aufgenommen.

**✅ ERLEDIGT (Design- und Qualitätsüberarbeitung):**
7. **Designsystem** konsolidiert: eine Typo-Skala (fluide `clamp()`), ein 8px-Abstandsraster,
   je eine Skala für Radien/Schatten/Bewegung/Z-Index – alles als Tokens in `:root`.
8. **Kopfzeile neu gebaut:** Marken-Dropdown (Maus, Tastatur inkl. Pfeiltasten/Home/End,
   Escape, Klick daneben), Mobil-Panel mit Backdrop, Fokusfalle, Scroll-Lock und
   Fokusrückgabe. Skip-Link. `--header-h` wird gemessen → Sprungmarken landen nicht mehr
   unter der fixierten Kopfzeile.
9. **Strahlen komplett neu** (siehe Abschnitt 3) – laufen nie mehr über Inhalte.
10. **Schriften lokal** (`assets/fonts/`), Google-Fonts-Einbindung entfernt → DSGVO + Tempo.
11. **Bilder** als `<picture>` mit WebP-Quelle: 3,4 MB → 0,8 MB. `assets/og-image.png` ergänzt.
12. **Formular** mit Pflichtfeld-Kennzeichnung, Feld-Fehlermeldungen (`aria-invalid`,
    `role="alert"`), Datenschutz-Checkbox mit Link, Erfolgs-/Fehlerstatus, `role="status"`.
13. **Tablet-Bereich (768–1000 px)** eigens gestaltet: Marken-Karten werden dort zu breiten
    Zeilen statt „2 + 1"-Waisen; Footer stapelt in 3 Spalten unter dem Markenblock.
14. **Barrierefreiheit:** Kontraste auf WCAG AA geprüft (automatisiert über alle Seiten),
    Tap-Ziele ≥ 24 px, eine `h1` pro Seite, lückenlose Überschriftenhierarchie,
    `prefers-reduced-motion`, vollständige Bedienbarkeit ohne JS.

**Inhalte & Recht (wichtig, vor Go-Live):**
- [x] **Echte Produktfotos / Packshots** der Präparate eingebaut (`assets/products/`).
- [ ] **Impressum verifizieren:** Geschäftsführer, vollständige USt-IdNr., genaue
      Register-/Aufsichtsangaben, ggf. Verantwortlicher i.S.d. § 18 MStV.
- [x] **Google Fonts** entfernt, Schriften lokal gehostet. ⚠️ `datenschutz.html` §5 wurde
      entsprechend umgeschrieben („keine Verbindung zu Dritten") – **muss rechtlich
      freigegeben werden**, ebenso der weiterhin offene Hosting-Absatz (§4).
- [ ] **Kontaktformular** an echtes Backend/Mail anbinden (aktuell nur Client-seitig,
      `mailto:`-Fallback). Optionen: Formspree, eigenes PHP, Netlify Forms.
      ⚠️ Die Auswahlliste „Ihr Anliegen" ist neu und rein funktional – Wortlaut der Optionen
      bitte vom Auftraggeber bestätigen lassen.
- [ ] Health-Claims juristisch prüfen (HCVO/LMIV): Wir sagen bewusst nichts Heilendes,
      Produkte sind Nahrungsergänzung/Medizinprodukt – Formulierungen konservativ halten.

**Funktionen / Ausbau (nice to have):**
- [ ] Echte Unterseiten je Produkt (Detail, Studien, FAQ) statt nur Sektionen.
- [ ] Englische Sprachversion (`/en/`) – die alte Seite hatte EN. Existiert bislang NICHT;
      erst dann sind `hreflang` und eine Sprachumschaltung sinnvoll.
- [ ] Händler-/Apothekenfinder oder „Wo kaufen?" mit Shop-Links (Shop-Apotheke etc.).
- [ ] Logo durch echtes Marken-Logo ersetzen, falls vorhanden (CI/Farben abgleichen).
- [x] OG-/Social-Preview-Bild (`assets/og-image.png`) erstellt.
- [ ] Cookie-Banner nur falls Tracking eingeführt wird.

**Technik:**
- [ ] Hosting festlegen und deployen (Domain ist vorhanden).
- [ ] Lighthouse-Check (Performance/SEO/Best Practices/Accessibility) vor Go-Live.
      (Bisher geprüft: kein horizontaler Überlauf und keine Konsolenfehler auf allen
      7 Seiten × 7 Viewports; Kontraste, Tap-Ziele und Semantik automatisiert.)
- [x] `sitemap.xml` (alle 5 öffentlichen Seiten) + `robots.txt` vorhanden.

---

## 5. Arbeitskonventionen (für mein zukünftiges Ich)

- **Sprache der Website:** Deutsch (primär). Inhalte konservativ/seriös formulieren.
- **Branch:** Entwicklung auf `claude/clever-faraday-9e5sjw`. Nicht auf andere Branches pushen.
  (Ausnahme: wenn der Auftrag ausdrücklich einen anderen Feature-Branch vorgibt.)
- **Kein Build nötig:** Änderungen direkt in den Dateien. Lokal testen:
  `python3 -m http.server 8000` und `http://localhost:8000` öffnen.
- **Keine externen Abhängigkeiten** ohne guten Grund (Egress kann blockiert sein) – und
  **zur Laufzeit gar keine**: die Seite lädt nichts von fremden Servern.
- **Neue Komponenten** immer über die Tokens aus `:root` bauen; kein zweites Styling-System,
  keine Einzelwerte in Komponenten. Icons immer in einen Container mit fester Größe legen
  UND per CSS auf `width`/`height` begrenzen (sonst rendern sie riesig).
- **Prüfroutine vor dem Abschluss:** alle Seiten in 375/390/768/1024/1280/1440/1728 rendern,
  auf horizontalen Überlauf und Konsolenfehler prüfen; zusätzlich Mobil-Menü, Dropdown,
  Tastatur, Formularfehler, `prefers-reduced-motion` und Darstellung ohne JS.
- Quellen der Inhaltsrecherche: oligase.de, lactrase.de, fructaid.de, gelbe-liste.de,
  apomio.de, Creditreform/Northdata (Firmendaten). Bei Änderungen Fakten gegenprüfen.

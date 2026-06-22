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
├── css/styles.css      # Komplettes Designsystem (Tokens, Komponenten, Responsive, Strahlen)
├── js/main.js          # Nav/Mobile-Menü, Scroll-Reveal, Formular, Jahr · Hero-Vollbild-Collapse · Produkt-Strahlen-Engine
├── assets/
│   ├── logo-original.png   # Wortmarke „pronatura®" (hochauflösend); im Footer per CSS auf Weiß invertiert
│   ├── favicon-32/180/192.png  # Favicons (Original)
│   ├── img/                # hero-products, office, brand-{lactrase,oligase,fructaid}, lifestyle-{milch,fructaid,oligase}
│   └── products/           # Packshots: lactrase.jpg, fructaid.png, oligase.png, lactrase-lineup.png
├── README.md           # Kurzanleitung (Hosting/Anpassen)
└── CLAUDE.md           # diese Datei
```

> Hinweis: **News-Sektion entfernt** (war veraltet, Stand 2024). „Zu unseren Marken" steht
> bewusst VOR „Unsere Mission". Die Firmengeschichte/Timeline liegt auf `ueber-uns.html`.

**🚀 DEPLOYMENT (WICHTIG!):** Die Live-Seite (`arielwyrobnik.github.io`) deployt von Branch
**`claude/clever-faraday-9e5sjw`**. Es gibt KEINEN `main`-Branch. Änderungen NUR sichtbar,
wenn sie auf `clever-faraday` landen (per Merge). Auf `claude/optimistic-pasteur-xgqrhv`
(System-Default) wird ebenfalls committet, dann nach `clever-faraday` gemerged + gepusht.
→ Wenn der Nutzer „ich sehe nichts" sagt: prüfen, ob `clever-faraday` aktuell ist.

**Designsprache:** Struktur an der Original-Website orientiert, sauberer/moderner umgesetzt.
**Bewusst neutrale Basis-Palette** – Anthrazit (`#1B1E22`) + Grautöne auf Weiß, KEINE
durchgehende Markenfarbe; Buttons/Links anthrazit. Farbe kommt aus den Produktfotos und den
**Produkt-Signaturfarben** (siehe unten). Display-Serif (Fraunces) + Sans (Plus Jakarta
Sans). Bild-getrieben statt Deko-Icons. Hintergrund **weiß**.

**Produkt-Signaturfarben** (aus den echten Verpackungs-Tiles ausgelesen; überall konsistent
verwendet – Marken-Tiles, Distributor-Bänder, Strahlen):
- Lactrase = **Blau `#3AB3E0`** · Oligase = **Dunkelgrün `#407740`** · Fructaid = **Lime `#C1DB5E`**
  (Strahl-Linie Fructaid minimal kräftiger `#B3D24A`, sonst auf Weiß zu blass).
- Produkt-Detailseiten nutzen je einen kräftigeren Akzent (kontrastsicher für Text/Buttons):
  Lactrase `#0A6AA1`, Fructaid `#5E9B1F`, Oligase `#2F6B3A`.

**Interaktive Effekte (alle in `js/main.js`, neutral/dezent):**
- **Hero-Vollbild:** Hero füllt beim Laden `100svh` und schrumpft beim ersten Scrollen
  EINMALIG auf normale Höhe (`.hero.is-collapsed`, kein Wieder-Aufklappen oben).
- **Produkt-Strahlen:** 3 SVG-Linien (`.rays`/`.ray--*`) sprießen aus den Hero-Produkten und
  zeichnen sich beim Scrollen (stroke-dashoffset). Pfade werden per JS aus echten Element-
  positionen berechnet (Hero → Marken-Karten → Distributor) und bei Resize/Hero-Collapse neu
  gebaut. Die Strahlen liegen HINTER Karten/Text (z-index) → verschwinden hinter den
  Marken-Karten und tauchen in den Zwischenräumen wieder auf. Hero-Bild bleibt dahinter
  (Ursprung).
- **Colorize/Fülleffekt:** Marken-Fotos starten entsättigt (`grayscale`) und färben sich,
  sobald der Strahl/die Karte in den Viewport scrollt (`.brand-card.is-lit`). Der
  **Distributor-Banner** (`.cta-banner--waves`) startet schwarz und blendet seine 3
  Signaturfarben (vertikale Wellen) ein, sobald die Strahlen eintreffen (`.is-lit`).
- **Footer-Welle:** einzelne Wellen-Silhouette (wie Etikett/Original) als Inline-Data-URI
  oben am Footer. (Original-Wave-SVG rendert NICHT als CSS-Background → clipPath/Transforms.)

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
5. **Interaktion** ergänzt: Hero-Vollbild-Collapse, Produkt-Strahlen, Colorize/Fülleffekt,
   Footer-Welle, farbiger Distributor-Banner (siehe Abschnitt 3, „Interaktive Effekte").
6. ⚠️ **Pektinkapseln** weiterhin NICHT aufgenommen.

**Inhalte & Recht (wichtig, vor Go-Live):**
- [x] **Echte Produktfotos / Packshots** der Präparate eingebaut (`assets/products/`).
- [ ] **Impressum verifizieren:** Geschäftsführer, vollständige USt-IdNr., genaue
      Register-/Aufsichtsangaben, ggf. Verantwortlicher i.S.d. § 18 MStV.
- [ ] **Datenschutzerklärung** mit echtem Hosting-/Tool-Setup abgleichen (Google Fonts
      werden derzeit extern geladen → ggf. lokal hosten für DSGVO; Cookie/Analytics?).
- [ ] **Kontaktformular** an echtes Backend/Mail anbinden (aktuell nur Client-seitig,
      `mailto:`-Fallback). Optionen: Formspree, eigenes PHP, Netlify Forms.
- [ ] Health-Claims juristisch prüfen (HCVO/LMIV): Wir sagen bewusst nichts Heilendes,
      Produkte sind Nahrungsergänzung/Medizinprodukt – Formulierungen konservativ halten.

**Funktionen / Ausbau (nice to have):**
- [ ] Echte Unterseiten je Produkt (Detail, Studien, FAQ) statt nur Sektionen.
- [ ] Englische Sprachversion (`/en/`) – die alte Seite hatte EN.
- [ ] Händler-/Apothekenfinder oder „Wo kaufen?" mit Shop-Links (Shop-Apotheke etc.).
- [ ] Logo durch echtes Marken-Logo ersetzen, falls vorhanden (CI/Farben abgleichen).
- [ ] OG-/Social-Preview-Bild (`assets/og-image.png`) erstellen.
- [ ] Cookie-Banner nur falls Tracking eingeführt wird.

**Technik:**
- [ ] Hosting festlegen und deployen (Domain ist vorhanden).
- [ ] Lighthouse-Check (Performance/SEO/Best Practices/Accessibility) vor Go-Live.
- [ ] Sitemap.xml + robots.txt ergänzen.

---

## 5. Arbeitskonventionen (für mein zukünftiges Ich)

- **Sprache der Website:** Deutsch (primär). Inhalte konservativ/seriös formulieren.
- **Branch:** Entwicklung auf `claude/clever-faraday-9e5sjw`. Nicht auf andere Branches pushen.
- **Kein Build nötig:** Änderungen direkt in den Dateien. Lokal testen:
  `python3 -m http.server 8000` und `http://localhost:8000` öffnen.
- **Keine externen Abhängigkeiten** ohne guten Grund (Egress kann blockiert sein).
- Quellen der Inhaltsrecherche: oligase.de, lactrase.de, fructaid.de, gelbe-liste.de,
  apomio.de, Creditreform/Northdata (Firmendaten). Bei Änderungen Fakten gegenprüfen.

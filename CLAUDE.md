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
├── index.html          # Startseite (Hero, Über uns, Produkte, Nachhaltigkeit, Qualität, Kontakt)
├── impressum.html      # Pflichtangaben (DE) – Platzhalter prüfen!
├── datenschutz.html    # DSGVO-Datenschutzerklärung – Platzhalter prüfen!
├── css/styles.css      # Komplettes Designsystem (Tokens, Komponenten, Responsive)
├── js/main.js          # Navigation, Scroll-Reveal, Mobile-Menü, Formular, Jahr im Footer
├── assets/
│   ├── logo.svg        # Wortmarke + Blatt-Icon
│   └── favicon.svg     # Favicon
├── README.md           # Kurzanleitung (Hosting/Anpassen)
└── CLAUDE.md           # diese Datei
```

**Designsprache:** Naturgrün-Palette (Wald-/Frischgrün) auf warmem Off-White,
Display-Serif (Fraunces) + klare Sans (Plus Jakarta Sans / Inter via Google Fonts),
sanfte Scroll-Animationen, responsives Layout, Glas-Navigation beim Scrollen.
Produktbilder sind aktuell **stilisierte SVG-Icons** (echte Packshots fehlen, siehe unten).

---

## 4. Offene Punkte / TODO (für die Zukunft)

**🚩 NÄCHSTE AUFGABE (sofort, höchste Priorität):**
Der Nutzer hat die Hosts `pro-natura-gmbh.de`, `lactrase.de`, `fructaid.de`, `oligase.de`
in der **Egress-Allowlist freigeschaltet**. Sie sollten ab dieser Session per `curl`
erreichbar sein (vorher kam „Host not in allowlist"). Zu tun, um die Seite näher ans
Original zu bringen:
1. **Zugriff testen:** `curl -sIL https://www.pro-natura-gmbh.de/` — wenn KEIN 403
   „Host not in allowlist" mehr kommt, ist es frei. Sonst Nutzer bitten, eine NEUE
   Session zu starten (Egress greift erst bei Container-Neustart).
2. **Logo + Favicon** vom Original ziehen → `assets/logo.*` / `assets/favicon.*` ersetzen.
   HTML-Einbindungen prüfen.
3. **Original-Farbtöne** aus deren CSS/Markup auslesen (Hauptgrün, Akzent, Hintergrund) →
   Tokens in `css/styles.css` (`:root`) angleichen. Nutzer will „die Farbtöne der
   Original-Webseite".
4. **Produktfotos / Packshots** für Lactrase®, Fructaid®, Oligase® 600 laden
   (von lactrase.de / fructaid.de / oligase.de) → `assets/products/` → in die
   Produktkarten (`.product-card`) statt der SVG-Icons einbauen.
5. **Allgemein näher ans Original** angleichen (Aufbau/Texte/Anmutung), aber optisch
   moderner halten. Hintergrund bleibt **blank/weiß** (so vom Nutzer gewünscht).
6. ⚠️ **Pektinkapseln NICHT** wieder aufnehmen (wird nicht mehr verkauft).

**Inhalte & Recht (wichtig, vor Go-Live):**
- [ ] **Echte Produktfotos / Packshots** der Präparate einbauen (`assets/products/`).
      Aktuell nur SVG-Platzhalter.
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

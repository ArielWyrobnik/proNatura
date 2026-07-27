# Pro Natura — Website

Moderne, schnelle Website für **Pro Natura Gesellschaft für gesunde Ernährung mbH**
(Bad Vilbel). Reines HTML/CSS/JS – **kein Build-Schritt**, keine Abhängigkeiten,
keine externen Requests zur Laufzeit.

## Lokal ansehen

```bash
# Im Projektordner:
python3 -m http.server 8000
# danach im Browser öffnen:
# http://localhost:8000
```

Ein lokaler Server ist nötig, damit die Schriften und Bilder korrekt geladen werden
(`file://` funktioniert nur eingeschränkt).

## Struktur

| Datei | Zweck |
|---|---|
| `index.html` | Startseite: Hero → Vertrauensband → Marken → Mission → Distributor-CTA → Kontakt |
| `ueber-uns.html` | Über uns, Firmengeschichte (Timeline 1994–2024), Kennzahlen |
| `lactrase.html`, `oligase.html`, `fructaid.html` | Produkt-Detailseiten |
| `impressum.html`, `datenschutz.html` | Pflichtseiten (DE) – Platzhalter ⚠️ noch prüfen |
| `css/styles.css` | Komplettes Designsystem (Tokens → Base → Komponenten → Responsive) |
| `js/main.js` | Kopfzeile, Navigation, Scroll-Reveal, Produkt-Strahlen, Kontaktformular |
| `assets/fonts/` | Lokal gehostete Schriften (woff2) – kein Google-Fonts-Request |
| `assets/img/`, `assets/products/` | Fotos und Packshots, jeweils als Original **und** `.webp` |
| `robots.txt`, `sitemap.xml` | SEO |
| `CLAUDE.md` | Projektkontext & offene Aufgaben |

## Anpassen

- **Texte/Inhalte:** direkt in den HTML-Dateien.
- **Design:** alle Werte als CSS Custom Properties in `:root` am Anfang von
  `css/styles.css` (Farben, Typo-Skala, Abstände, Radien, Schatten, Bewegung,
  Z-Index). Bitte keine Einzelwerte hart in Komponenten schreiben.
- **Produkt-Signaturfarben:** `--lactrase*`, `--oligase*`, `--fructaid*`.
  Die `*-ink`-Varianten sind kontrastgeprüft (WCAG AA) und für Text/Buttons gedacht.
- **Bilder:** Immer als `<picture>` mit `.webp`-Quelle und Original als Fallback
  einbinden, mit `width`/`height` gegen Layout Shift.

### Schriften aktualisieren

Die Schriften liegen als Variable Fonts in `assets/fonts/` und werden in
`css/styles.css` per `@font-face` (Subsets `latin` und `latin-ext`) eingebunden.
Beim Austausch die Dateinamen beibehalten oder die `@font-face`-Blöcke anpassen.

## Barrierefreiheit & Performance

- Skip-Link, sichtbare Fokusringe, `aria-expanded`/`aria-controls` an Menüs,
  Escape schließt Menüs, Fokus bleibt im offenen Mobil-Menü, Scroll-Lock.
- `prefers-reduced-motion` wird respektiert: Reveals und Strahlen stehen still,
  Inhalte bleiben vollständig sichtbar.
- Ohne JavaScript ist die gesamte Seite sichtbar und bedienbar; die dekorativen
  Strahlen entfallen dann.
- Kontraste sind gegen WCAG 2.1 AA geprüft.

## Vor dem Go-Live

Siehe Checkliste in **`CLAUDE.md`** (Abschnitt „Offene Punkte / TODO") –
insbesondere Impressum/Datenschutz verifizieren und das Kontaktformular an ein
echtes Backend anbinden.

## Hosting

Da rein statisch, läuft die Seite überall: klassischer Webspace (FTP-Upload),
GitHub Pages, Netlify, Vercel, o. Ä. Einfach den gesamten Ordnerinhalt hochladen.

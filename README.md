# Pro Natura — Website

Moderne, schnelle Website für **Pro Natura Gesellschaft für gesunde Ernährung mbH**
(Bad Vilbel). Reines HTML/CSS/JS – **kein Build-Schritt**, keine Abhängigkeiten.

## Lokal ansehen

```bash
# Im Projektordner:
python3 -m http.server 8000
# danach im Browser öffnen:
# http://localhost:8000
```

(Alternativ: `index.html` einfach direkt im Browser öffnen.)

## Struktur

| Datei | Zweck |
|---|---|
| `index.html` | Startseite (Hero, Produkte: Lactrase/Fructaid/Oligase, Über uns, Ablauf, Nachhaltigkeit, Kontakt) |
| `impressum.html` / `datenschutz.html` | Pflichtseiten (DE) – Platzhalter ⚠️ noch prüfen |
| `css/styles.css` | Komplettes Designsystem |
| `js/main.js` | Navigation, Scroll-Animationen, Kontaktformular |
| `assets/` | Logo & Favicon (Original-PNG), `products/` mit Packshots |
| `robots.txt`, `sitemap.xml` | SEO |
| `CLAUDE.md` | Projektkontext & offene Aufgaben |

## Anpassen

- **Texte/Inhalte:** direkt in den HTML-Dateien.
- **Farben/Design:** Variablen am Anfang von `css/styles.css` (`:root`).
- **Logo:** `assets/logo-original.png` (dunkel) bzw. `assets/logo-white.png` (Footer).
- **Produktfotos:** liegen in `assets/products/` und sind in den Produktkarten eingebunden.

## Vor dem Go-Live

Siehe Checkliste in **`CLAUDE.md`** (Abschnitt „Offene Punkte / TODO") –
insbesondere Impressum/Datenschutz verifizieren, Kontaktformular an ein echtes
Backend anbinden und Produktfotos ergänzen.

## Hosting

Da rein statisch, läuft die Seite überall: klassischer Webspace (FTP-Upload),
GitHub Pages, Netlify, Vercel, o. Ä. Einfach den gesamten Ordnerinhalt hochladen.

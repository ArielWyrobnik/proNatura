# tools/ — Prüfskripte

Reine **Entwicklungswerkzeuge**. Sie sind nicht Teil der Website, werden von
keiner Seite geladen und haben keinen Einfluss auf das Deployment. Die Website
selbst bleibt weiterhin ohne Build-Schritt und ohne Laufzeit-Abhängigkeiten.

## Voraussetzungen

```bash
cd tools
npm i playwright          # einmalig, landet in tools/node_modules (gitignored)
python3 -m pip install pillow   # nur für analyze.py
```

> Global installiertes Playwright reicht nicht: Node findet globale Pakete
> beim `import` nicht. Deshalb lokal in `tools/` installieren.

Die Skripte erwarten die Seite unter `http://127.0.0.1:8000`:

```bash
python3 -m http.server 8000     # im Projektordner, in einem zweiten Terminal
```

Alle Skripte werden aus **diesem Ordner** heraus gestartet und legen ihre
Ausgaben dort ab.

## Die Skripte

| Skript | Prüft |
|---|---|
| `shoot.mjs <ordner>` | Alle 14 Seiten (7 deutsch, 7 englisch) × 7 Viewports × 3 Scrollpositionen. Meldet horizontalen Überlauf (inkl. der verursachenden Elemente) und Konsolenfehler. |
| `raytext.mjs` | **Die wichtigste Regression für die Produkt-Strahlen.** Rendert **beide** Startseiten (deutsch und englisch) mit magenta, 7 px breiten Strahlen (fast dreifache Normalbreite) und schießt die ganze Seite ab. Danach `analyze.py` laufen lassen – es prüft pixelweise, ob ein Strahl in der Box eines Textelements landet. |
| `analyze.py [ordner]` | Wertet die Aufnahmen von `raytext.mjs` aus. Erwartete Ausgabe: `KEIN Strahl über einer Textbox`. |
| `interact.mjs` | Mobil-Menü (Fokusfalle, Escape, Scroll-Lock, Backdrop), Marken-Dropdown (Maus + Tastatur), Skip-Link, Sprungmarken unter der Kopfzeile, Formular-Validierung, `prefers-reduced-motion`, Darstellung ohne JS, Deep-Link, schnelles Scrollen mit Resize, Farbaufbruch-Ursprünge, Strahlen-Startzustand, Höhenstabilität der Kopfzeile, Gleichlauf der Kontaktspalten, Abteile des Distributor-Bands. |
| `look.mjs` | Fährt die Startseite in kleinen Schritten durch und schießt an festen Punkten ab, danach wieder ganz nach oben. Zum Ansehen von Strahlenlauf, Farbaufbruch und Rückweg – kein Test, sondern Augenschein. |
| `measure.mjs` | Gibt die echte Geometrie der Startseite aus (Hero, Vertrauensband, Abschnittskopf, Karten, Missionsspalte, Band). Grundlage für jede Änderung an der Strahlen-Wegführung – die Kanäle werden aus genau diesen Kästen berechnet. |
| `a11y.mjs` | Kontrast aller Textknoten gegen WCAG 2.1 AA (nur bei deckendem Hintergrund; Verläufe und Bilder müssen von Hand geprüft werden). |
| `touch.mjs` | Tap-Ziele ≥ 24 px bei 390 px Breite (Inline-Links im Fließtext sind laut WCAG 2.5.8 ausgenommen). |
| `svgcheck.mjs` | Übergroße Icons, fehlende `alt`-Texte, Sprünge in der Überschriftenhierarchie, genau eine `h1` je Seite, Formularfelder ohne Label. |
| `perf.mjs` | Requests, Übertragungsgröße, LCP, CLS und ob ein externer Request rausgeht (muss `keine` sein). |
| `parity.mjs` | **Deutsche und englische Fassung dürfen nicht auseinanderlaufen.** Vergleicht das Gerüst beider Fassungen (Abschnitte, Überschriftenfolge, Bilder, Formularfelder, Navigations- und Fußzeilenlinks), prüft `lang`, canonical, die drei `hreflang`-Verweise und dass der Sprachumschalter auf beiden Seiten zum jeweiligen Gegenstück führt. |
| `banner.mjs` | Der weiße Text im Distributor-Band muss über acht Breiten im dunklen Oligase-Abteil bleiben. Rutscht er ins blaue oder lime Abteil, ist er unlesbar. |
| `lines.mjs` | Blöcke mit festen `<br>`-Zeilen (Adresse, Telefon) dürfen nicht auf Kante sitzen. Sitzt eine Zeile exakt auf der Boxbreite, bricht sie in einer anderen Engine mitten im Wort um – in Chromium sieht man davon nichts. |

## Vor jeder Änderung an der Strahlen-Wegführung

```bash
node raytext.mjs && python3 analyze.py
```

Die Wegführung in `js/main.js` ist so gebaut, dass die Linien ausschließlich
durch freie Zonen laufen (Randkanäle neben dem zentrierten Abschnittskopf,
Spalt zwischen den Marken-Karten, Spalte zwischen Missionsbild und -text).
Verschiebt sich das Layout, kann diese Annahme kippen — dieser Test merkt es.

## Vollständiger Durchlauf

```bash
node shoot.mjs out && node interact.mjs && node a11y.mjs \
  && node touch.mjs && node svgcheck.mjs && node lines.mjs && node banner.mjs \
  && node parity.mjs \
  && node perf.mjs \
  && node raytext.mjs && python3 analyze.py
```

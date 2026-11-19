# Website Camping- und Naturfreunde Türlersee

Statische Website des Vereins (reines HTML, CSS und JavaScript – kein Build nötig).

## Aufbau

| Datei | Inhalt |
| --- | --- |
| `index.html` | Startseite |
| `verein.html` | Geschichte, Zweck, Vorstand, Mitglieder, Anmeldung |
| `aktivitaten.html` | Jahresprogramm (wird aus `assets/js/events.js` erzeugt) |
| `tuerlersee.html` | Links rund um den Türlersee |
| `danke.html` | Bestätigung nach der Anmeldung |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `assets/` | Bilder, Schriften, Stylesheet, Skripte |

## Häufige Änderungen

- **Jahresprogramm (Tabelle):** direkt in `aktivitaten.html` die Tabellenzeilen anpassen.
- **Neue Veranstaltung mit Details/Flyer:** in `assets/js/events.js` einen Block kopieren und anpassen.
  Kommende Anlässe erscheinen automatisch oben, vergangene im Archiv.
- **Anmeldeformular:** wird über [FormSubmit](https://formsubmit.co) direkt per E-Mail verschickt. Die Empfänger-Adresse steht in `verein.html` im `action`-Attribut des Formulars. Nach einer Adressänderung kommt beim ersten Absenden ein Bestätigungs-Mail von FormSubmit – dort einmal auf «Activate Form» klicken. Danach landen die Besucher auf `danke.html`.
- **Vorstand / Mitgliederzahl:** direkt in `verein.html`.

## Veröffentlichen mit GitHub Pages

Auf GitHub unter *Settings → Pages* bei «Build and deployment» die Quelle
*Deploy from a branch* wählen, Branch und Ordner `/ (root)` auswählen und speichern.

## Lokal ansehen

```
python3 -m http.server 8000
```

und dann <http://localhost:8000> öffnen.

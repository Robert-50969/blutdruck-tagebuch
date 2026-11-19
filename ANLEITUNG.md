# Blutdruck-App für Android bauen und installieren

Die Werte bleiben ausschließlich auf deinem Handy. Die App braucht kein Internet und schickt nichts irgendwohin. Einzige Ausnahme: Beim ersten Scan lädt Google einmalig das Scanner-Modul für die Kamera nach (siehe unten).
Gebaut wird sie einmalig kostenlos bei GitHub, danach installierst du die fertige Datei auf dem Handy.

## 1. Konto und Projekt bei GitHub anlegen

1. Auf github.com ein kostenloses Konto anlegen und anmelden.
2. Oben rechts auf das Plus-Zeichen tippen, dann "New repository" wählen.
3. Name zum Beispiel `blutdruck`. Wichtig: **Private** auswählen. Im Projekt liegt der Signaturschlüssel deiner App, den sollen andere nicht sehen.
4. "Create repository" wählen.

## 2. Dateien hochladen

1. Die ZIP-Datei auf dem Computer entpacken.
2. Auf der Seite des neuen Projekts den Link "uploading an existing file" wählen.
3. Den **Inhalt** des entpackten Ordners `blutdruck-app` (nicht den Ordner selbst) mit allen Dateien und Unterordnern in das Fenster ziehen und unten "Commit changes" wählen.
4. Falls der versteckte Ordner `.github` nicht mit hochgeladen wurde: "Add file", dann "Create new file". Als Namen genau `.github/workflows/build.yml` eintippen. Den Inhalt der Datei `build-workflow.yml` aus dem ZIP hineinkopieren und mit "Commit changes" speichern.

## 3. App bauen lassen

1. Oben auf "Actions" tippen. Der Ablauf "APK bauen" startet nach dem Hochladen von selbst. Falls nicht: links "APK bauen" wählen, dann "Run workflow".
2. Warten, bis ein grüner Haken erscheint. Das dauert etwa 5 bis 10 Minuten.
3. Auf der Startseite des Projekts rechts auf "Releases" tippen und die neueste Version öffnen.
4. Die Datei `Blutdruck.apk` herunterladen.

## 4. Auf dem Handy installieren

1. Die heruntergeladene Datei `Blutdruck.apk` öffnen.
2. Android fragt, ob der Browser Apps installieren darf. Das einmal erlauben.
3. Falls Google Play Protect warnt ("unbekannter Entwickler"), "Trotzdem installieren" wählen. Die App hat keinen Play-Store-Eintrag, deshalb kommt die Meldung.
4. Nach der Installation findest du die App "Blutdruck" mit einem Herz-Symbol im App-Menü.

## Später aktualisieren

Wenn es eine neue Version gibt, legst du die geänderten Dateien im Projekt ab, wartest auf den grünen Haken und installierst die neue `Blutdruck.apk` einfach über die bestehende App. Deine Werte bleiben erhalten. Die App vorher nicht deinstallieren, sonst sind die Werte weg.

## Wichtig zu den Daten

- Die Werte liegen nur im geschützten Speicher der App auf diesem Handy. Es gibt bewusst keine automatische Cloud-Sicherung von Android.
- Bei Handywechsel, Zurücksetzen oder Deinstallation sind die Werte weg. Nutze deshalb ab und zu "Alle Werte als CSV teilen" im Bereich "Sicherung" und speichere die Datei an einem Ort deiner Wahl, zum Beispiel per Mail an dich selbst.
- Mit "CSV importieren" spielst du so eine Sicherung wieder ein.
- Das PDF erzeugt die App direkt auf dem Handy. Im Teilen-Menü wählst du deine Mail-App.

## Medikamente, Packung scannen und Rezept-Erinnerung

- Der Bereich **Medikamente** ist über die Leiste unten erreichbar. Dort steht auch das **PDF für den Arzt** und die **Sicherung**.
- **Scannen:** Unter "Medikament hinzufügen" auf "Scannen" tippen und den Strichcode mit der PZN auf der Packung ins Bild halten. Die App prüft die PZN über die Prüfziffer. Alternativ die 8 Ziffern neben dem Strichcode eintippen.
- **Name und Packungsgröße:** Dafür gibt es keine freie Datenbank. Beim ersten Mal einer PZN trägst du Name und Packungsgröße selbst ein. Danach erkennt die App die PZN wieder und füllt beides aus. Wird dieselbe PZN erneut gescannt, bietet die App an, die Packung zum Vorrat zu addieren.
- **Einnahme:** Anzahl pro Gabe für morgens, mittags, abends und zur Nacht (zum Beispiel 1-0-1-0, halbe Tablette: 0,5).
- **Rezept-Erinnerung:** Aus Vorrat und Einnahme rechnet die App, bis wann die Packung reicht. 7 Tage vorher erscheint oben ein roter Hinweis und ein Punkt am Reiter "Medikamente". Stimmt der Vorrat nicht mehr (Tabletten vergessen oder verloren), korrigierst du ihn mit "Vorrat zählen".
- **Scanner-Modul:** Der Scanner kommt von den Google Play-Diensten und braucht keine Kamera-Berechtigung für die App. Beim allerersten Scan lädt Google das Modul einmalig nach. Dafür braucht das Handy dann kurz Internet. Auf Handys ohne Google Play-Dienste bleibt nur die Eingabe der PZN von Hand.

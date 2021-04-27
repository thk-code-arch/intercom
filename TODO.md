## ToDO 2021-04-27

## Frontend

### Login

- [x] Login mit bestehendem Konto
- [x] Registrierung ueber Invite Code
- [x] Passwort vergessen!

### Home

- [ ] Uebersicht aller Seiten

### Project

- [x] Übersicht Projekte
  - [x] Subprojekte anzeigen
- [x] Neues projekt erstellen (admin)
  - [x] Subprojekte erstellen (admin)

### View

- [x] Einbindung ThreeJS
  - [x] Kamera Koordinaten an Server uebertragen
  - [x] Avatar Modelle anhand Koordinaten laden
    - [ ] Avatar direction
  - [ ] Elemente klickbar machen ( border color )
  - [ ] Materialdaten uebertragen
- [x] Einbindung Project Chatroom
  - [x] Online Status
  - [x] Sicht des anderen einnehmen anhand Koordinaten
  - [ ] Eigene Koordinaten als Link posten
- [ ] Issue Management
  - [ ] Neues Issue erstellen
  - [ ] Bim Collab Sync
  - [ ] Issues Liste
- [x] Materials
  - [ ] Materialdaten Liste und klickbar machen
- [x] Saved Views
  - [x] Screenshot erstellen und ablegen
  - [x] Screenshot Annotation
- [x] Files
  - [x] Projekstpezifische Dateien ablegen mit Modell verknuepfen

### Chat

- [x] Uebersicht aller Chatraeume und Raumwechsel
- [ ] Protokoll erstellen (Zeitraum) export pdf
- [ ] Neuen Allgemeinen Raum erstellen
- [ ] Neuen Private Chat erstellen
- [ ] File Upload, Emojis
- [ ] Chat Notifications

### Learnings

- [ ] Ubersicht in Karten ( Videos, PDF, externe Links )
  - [x] Neues Learning anlegen
    - [x] Youtube Vimo Vorschau
    - [ ] Links, PDF Vorschau
    - [ ] ggf Kommentarfunktion, Likes
  - [ ] Tags
- [ ] automatische Einbindung der Wiki Beitraege in die Uebersicht

### Project Edit

- [x] IFC - IfcConvert - GLTF Upload
- [x] Projektname / Beschreibung setzen
- [ ] Projekt löschen

### User Profil

- [x] Bearbeiten persoehnliche Daten ( Profilbild, etc)
- [ ] Initialisierung einer BIM Collab Verbindung

### Admin - User Management

- [x] Ubersicht aller Benutzer Chatrooms Projekte
- [x] Benutzer zu Admin delegieren
- [x] Benutzer zu Projekten zuweisen ( Batch: Emailadressen)
- [ ] Benutzer deaktivieren

### Sonstiges

- [ ] ~~ggf. VideoAudio Stream ( moeglich mit 3rd Party Services)~~

## Backend

### Generell

- [x] Authentifizierung
- [x] Anbindung Datenbank
- [x] Anbindung Mailversand
- [x] FileUpload
- [x] Socketserver
- [ ] Anbindung externer APIs
  - [x] Fetch Video description
- [x] API Umstellung auf NestJS Framework

### IFC Loader

- [x] Konvertierung von IFC zu GLTF ueber Skripte
- [ ] ~~Anbindung IFC-Model checker (Jakob Beetz, RWTH Aachen)~~

## Tests
- [ ] Integration von Tests in CI Pipeline
- [ ] Unit Tests fuer Backend
- [ ] Integrationstest mit Backend/Frontend/DB
- [ ] Demo App
  - [ ] Browser Bot test

## DevOps
- [x] Lokale Docker Development umgebung
- [x] Dockerhub: Intercom-dev & Intercom
- [x] Docker Release strategie
  - [ ] automatisierte Changelogs

## Docs
- [ ] Github Repo fuer Docs
- [ ] Issue Management

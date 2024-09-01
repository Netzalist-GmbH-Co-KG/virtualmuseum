# TimeGlideVR - Administrationsoberfläche

Diese Anwendung bietet eine Administrationsoberfläche für die TimeGlideVR-Anwendung, eine VR-Erfahrung für MetaQuest 3. Sie besteht aus einer API und einem webbasierten Benutzerinterface.

## Hauptfunktionen

- Verwaltung von VR-Inhalten und Inventar
- Konfiguration von topographischen Tabellen und Zeitreihen
- Benutzeradministration
- API-Key-Verwaltung
- Release-Management für VR-Anwendungen

## Technologiestack

- Backend: ASP.NET Core 8.0
- Frontend: Blazor mit Radzen-Komponenten
- Datenmodell: Eigene Klassen in virtualmuseum.web.data

## Projektstruktur

- `virtualmuseum.web.api`: Hauptprojekt mit API und Blazor-Oberfläche
- `virtualmuseum.web.data`: Datenmodelle und gemeinsam genutzte Klassen

## Installation und Start

1. Stellen Sie sicher, dass .NET 8.0 SDK installiert ist
2. Klonen Sie das Repository
3. Navigieren Sie zum Verzeichnis `virtualmuseum.web.api`
4. Führen Sie `dotnet restore` aus
5. Starten Sie die Anwendung mit `dotnet run`

## Konfiguration

- Umgebungsvariablen können in einer `.env`-Datei konfiguriert werden
- API-Konfigurationen finden Sie in den entsprechenden Konfigurations-Dateien

## Entwicklung

- Verwenden Sie Visual Studio oder Visual Studio Code für die Entwicklung
- Blazor-Komponenten befinden sich im `Components`-Verzeichnis
- API-Controller sind im `Api`-Verzeichnis zu finden

## Lizenz

(c) 2024 by Netzalist GmbH & Co. KG

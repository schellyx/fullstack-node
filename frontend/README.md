# Mini-Notizblock

Eine einfache Notizblock-Anwendung, erstellt mit React und Vite.

## Funktionen

*   Hinzufügen neuer Notizen
*   Löschen bestehender Notizen

## Verwendete Technologien

*   React
*   Vite
*   JavaScript
*   HTML
*   CSS (Inline-Styles)

## Setup und Installation

1.  **Klone das Repository:**
    ```bash
    git clone <repository-url>
    cd vite-project
    ```
2.  **Installiere die Abhängigkeiten:**
    ```bash
    npm install
    ```

## Verfügbare Skripte

Im Projektverzeichnis kannst du folgende Befehle ausführen:

*   **`npm run dev`**
    Startet die Anwendung im Entwicklungsmodus.
    Öffne [http://localhost:5173](http://localhost:5173) (oder den in der Konsole angezeigten Port), um sie im Browser anzuzeigen.

*   **`npm run build`**
    Erstellt die Anwendung für die Produktion im `dist`-Ordner.

*   **`npm run lint`**
    Führt ESLint aus, um Code-Stil-Probleme zu finden.

*   **`npm run preview`**
    Startet einen lokalen Server, um den Produktionsbuild (`dist`-Ordner) zu testen.

## Docker Deployment

Das Projekt enthält ein [Dockerfile](c:\Users\nutri\TechstarterWorkspace\node-container\vite-project\Dockerfile) zur einfachen Bereitstellung mit Nginx.

1.  **Erstelle den Produktionsbuild:**
    ```bash
    npm run build
    ```
2.  **Baue das Docker-Image:**
    ```bash
    docker build -t mini-notizblock .
    ```
3.  **Starte den Docker-Container:**
    ```bash
    docker run -d -p 8080:80 mini-notizblock
    ```
    Die Anwendung ist dann unter [http://localhost:8080](http://localhost:8080) erreichbar.

## Persistente Datenspeicherung

### Entscheidung: Bind Mount

Für die persistente Speicherung der Daten des Backends wurde in der Entwicklungsumgebung ein **Bind Mount** gewählt. 

### Begründung

#### Vorteile von Bind Mounts:
1. **Direkter Zugriff auf Dateien**:
   - Änderungen an den Daten (z. B. `nodes-data.json`) können direkt im Host-Dateisystem vorgenommen und überprüft werden.
2. **Einfaches Debugging**:
   - Entwickler können die gespeicherten Daten während der Entwicklung inspizieren und manuell bearbeiten.
3. **Keine zusätzliche Konfiguration**:
   - Es ist keine explizite Erstellung eines Docker-Volumes erforderlich, da das Host-Dateisystem direkt verwendet wird.

#### Nachteile von Bind Mounts:
- **Abhängigkeit vom Host-Dateisystem**:
  - Der Container ist auf die Struktur und Verfügbarkeit des Host-Dateisystems angewiesen.
- **Potenzielle Sicherheitsrisiken**:
  - Der Container hat direkten Zugriff auf das Host-Dateisystem, was ungewollte Änderungen ermöglichen könnte.

#### Warum kein Named Volume?
Ein **Named Volume** wäre in einer Produktionsumgebung sinnvoller, da es:
- Daten unabhängig vom Host-Dateisystem speichert.
- Bessere Isolation und Portabilität bietet.
- Automatisch von Docker verwaltet wird.

In der Entwicklungsumgebung ist jedoch der direkte Zugriff auf die Daten wichtiger als die Isolation, weshalb ein Bind Mount bevorzugt wurde.

### Nutzung des Bind Mounts

Um das Backend mit einem Bind Mount zu starten, verwende den folgenden Befehl:

```bash
docker run -d \
  -p 3000:3000 \
  -v "$(pwd)/nodes-data.json:/usr/src/app/nodes-data.json" \
  --name fullstack-backend \
  fullstack-backend-image

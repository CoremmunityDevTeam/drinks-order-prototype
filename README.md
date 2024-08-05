
# Drinks Order Prototype

Dies ist eine einfache Webanwendung zur Verwaltung von Getränkebestellungen. Die Anwendung ermöglicht es Benutzern, ihre Getränkebestellungen einzugeben, und bietet eine Admin-Seite zur Übersicht aller Bestellungen.

## Voraussetzungen

- Node.js und npm müssen installiert sein.
  - [Node.js herunterladen](https://nodejs.org/)

## Installation

1. **Repository klonen oder Zip-Datei entpacken**
   ```bash
   git clone https://github.com/CoremmunityDevTeam/drinks-order-prototype.git
   # oder entpacke die Zip-Datei in ein Verzeichnis deiner Wahl
   ```

2. **In das Projektverzeichnis wechseln**
   ```bash
   cd drinks-order-prototype
   ```

3. **Abhängigkeiten installieren**
   ```bash
   npm install
   ```

4. **Datenbank initialisieren**
   Führe das Skript `initializeDB.js` aus, um die SQLite-Datenbank und die erforderlichen Tabellen zu erstellen.
   ```bash
   node initializeDB.js
   ```
5. **Twitch Authentication Integration**
   Lege .env Config File mit den folgenden Werten an
   ```
   TWITCH_CLIENT_ID="<Client ID>"
   TWITCH_CLIENT_SECRET ="<Client Secret>"
   CALLBACK_URL="http://localhost:3000/auth/twitch/callback" 
   SESSION_SECRET="<Custom Session Secret not from Twitch>"
   PAYPAL_LINK="<Link to PaypalMe to the payment of the drinks>"
   ADMIN_USERS="Comma seperated list of twitch usernames which should get access to the admin pages"
   ```

## Anwendung starten

1. **Server starten**
   ```bash
   npm start
   ```

2. **Webanwendung öffnen**
   Öffne deinen Browser und gehe zu [http://localhost:3000](http://localhost:3000)

## Verzeichnisstruktur

- `public/` - Enthält die statischen Dateien (HTML, CSS, JS)
  - `index.html` - Benutzeroberfläche für Getränkebestellungen
  - `index_script.js` - JavaScript-Datei für die Startseite
  - `admin.html` - Admin-Oberfläche zur Übersicht aller Bestellungen
  - `admin-script.js` - JavaScript-Datei für die Admin-Seite
  - `styles.css` - CSS-Datei für das Styling
  - `order.html` - Bestell Seite für Getränke
  - `order-script.js` - JavaScript-Datei für die Bestell-Seite
- `api/` - API Routen
  - `routes.js` 
- `auth/` 
  - `config.js`
  - `routes.js` - Authentifizierungsrouten
- `datapase.js` -  Datenbankverbindung und -initialisierung.
- `routes.js` 
- `server.js` - Node.js-Server
- `initializeDB.js` - Skript zur Initialisierung der SQLite-Datenbank
- `package.json` - Listet die Projektabhängigkeiten und Skripte auf

## Datenbank

Die Anwendung verwendet eine SQLite-Datenbank (`getraenke.db`), die im Projektverzeichnis erstellt wird. Das Skript `initializeDB.js` erstellt die erforderlichen Tabellen.

## Endpunkte

- **GET /api/orders** - Liefert alle Bestellungen eines Benutzers (erfordert `name` als Query-Parameter)
- **POST /api/orders** - Erstellt eine neue Bestellung
- **GET /admin** - Liefert die Admin-Seite
- **GET /api/all-orders** - Liefert alle Bestellungen (für die Admin-Seite)



# Hosting MSSQL Backend on Railway

Because you chose to stay with **MSSQL**, you need to set up a dedicated SQL Server instance on Railway and configure your backend to connect to it.

## 1. Create the MSSQL Database on Railway

1.  Log in to your [Railway Dashboard](https://railway.app/).
2.  Click **+ New Project** -> **Deploy from Template**.
3.  Search for **Microsoft SQL Server**.
4.  Select the **Official Microsoft SQL Server** template.
5.  **Crucial**: In the deployment variables, find `ACCEPT_EULA` and set it to `Y`.
6.  Once deployed, go to the **Variables** tab of the new MSSQL service. You will need these:
    *   `MSSQL_USER` (usually `sa`)
    *   `MSSQL_PASSWORD`
    *   `MSSQL_DB` (your database name)
    *   **TCP Proxy URL** (The external host and port, e.g., `mssql.railway.internal:1433`)

## 2. Configure your Backend Variables

In your Railway **Backend** service settings (under **Variables**), add or update the following:

| Variable | Value from Railway MSSQL |
| :--- | :--- |
| `DB_USER` | Use the `sa` or the provided user. |
| `DB_PWD` | Use the generated password. |
| `DB_NAME` | The name of your database (e.g., `Planadb`). |
| `XP_SERVER` | The **Host** part of your TCP Proxy (e.g., `xxx.railway.internal`). |
| `DB_PORT` | `1433` |

## 3. Initialize the Database Schema

Since this is a new database, your tables and stored procedures don't exist yet.

1.  Open **SQL Server Management Studio (SSMS)** or **Azure Data Studio** on your computer.
2.  Connect to the Railway MSSQL instance using the **TCP Proxy URL**, username, and password.
3.  Run the scripts located in your project directory:
    *   `BACKEND/src/database/tables/*.sql`
    *   `BACKEND/src/database/stored_procedures/*.sql`

## 4. Deploy the Backend

1.  Ensure your **Root Directory** for the Backend service is set to `BACKEND`.
2.  Ensure the **Build Command** is `npm run start:build` (to compile TypeScript).
3.  Ensure the **Start Command** is `npm run start:run`.

---
**Tip**: MSSQL requires at least **2GB of RAM** to run reliably on Railway. Ensure your service plan has enough memory allocated, or the database container might crash.

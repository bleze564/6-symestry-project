# InvestIQ

A personal finance tracker built with React, TypeScript, Redux Toolkit, Express, and MySQL.

## Prerequisites

Install:

- Node.js 22 or later
- MySQL Server 9.x
- MySQL Workbench (for database setup)

## 1. Get the project

Clone or download the repository, then open the project root in VS Code. The project root contains `src/`, `server/`, and the frontend `package.json`.

## 2. Create the database

1. Start the MySQL Server service.
2. Open MySQL Workbench and connect to your local MySQL instance using an administrator account.
3. Open `server/schema.sql` in Workbench.
4. In the script, replace `replace-with-your-local-password` in the `CREATE USER` statement with a strong local password.
5. Execute the full script with the lightning button. It creates the `investiq` database, the `users` and `transactions` tables, and the restricted `investiq_app` account.

If `investiq_app` already exists, `CREATE USER IF NOT EXISTS` will not change its password. Set the password explicitly in Workbench and grant the database permissions:

```sql
ALTER USER 'investiq_app'@'localhost' IDENTIFIED BY 'your-local-password';
GRANT SELECT, INSERT, UPDATE, DELETE ON investiq.* TO 'investiq_app'@'localhost';
```

Use the same password in the next step.

## 3. Configure the API

From the project root, copy the server environment template:

```bash
cp server/.env.example server/.env
```

Open `server/.env` and set `DB_PASSWORD` to the password assigned to `investiq_app`. Keep the other defaults for a local MySQL setup:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=investiq_app
DB_PASSWORD=your-local-password
DB_NAME=investiq
PORT=3001
```

If the password contains `#`, spaces, or other special characters, wrap it in double quotes. Never commit `server/.env`; it contains local credentials and is ignored by Git.

## 4. Install dependencies

Open a terminal in the project root and install the frontend dependencies:

```bash
npm install
```

Open a second terminal in the project root and install the API dependencies:

```bash
cd server
npm install
```

## 5. Run both parts

In the API terminal, which is now inside `server`, start the API and leave it running:

```bash
npm start
```

The terminal should show `Server running at http://localhost:3001`.

In a separate terminal opened at the project root, start the frontend:

```bash
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`. The Vite development server proxies `/api` requests to the API on port `3001`.

## 6. Verify the setup

Open `http://localhost:3001/api/health/db`. A working database connection returns:

```json
{"connected":true}
```

Then use the website to register an account, add an income or expense, refresh the page, and confirm the transaction is still listed. Log out and log back in to verify the same account data is loaded.

## Troubleshooting

- **`Request failed` or `404` during registration:** Restart the API from `server` with `npm start`. If `vite.config.ts` was just changed, restart the Vite dev server too. Keep both terminals open.
- **`Access denied for user`:** Check `DB_USER` and `DB_PASSWORD` in `server/.env`. If the MySQL account already existed, run the `ALTER USER` and `GRANT` statements above.
- **Unknown database or missing table:** Reopen and execute `server/schema.sql` in Workbench.
- **Email already exists:** Use the login page for that account, or register with a different email.
- **Port already in use:** Stop the older API or Vite process with `Ctrl+C`, then start it again.
- **Cannot connect to MySQL:** Confirm the MySQL Server service is running and that `DB_HOST` and `DB_PORT` match the local server.

## Notes

User accounts and transactions are stored in MySQL. Passwords are stored as scrypt hashes. Local API sessions are held in server memory, so users must sign in again after the API restarts. This setup is intended for local coursework demonstrations, not production hosting.

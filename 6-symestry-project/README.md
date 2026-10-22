# InvestIQ

A personal finance tracker built with React, TypeScript, Redux Toolkit, Express, and MySQL.

## Run locally

1. Install Node.js and MySQL Server.
2. Open `server/schema.sql` in MySQL Workbench. Replace the password placeholder with a local password, then execute the script.
3. Copy `server/.env.example` to `server/.env` and use the same password for `DB_PASSWORD`.
4. Start the API from `server`:

   ```bash
   npm install
   npm start
   ```

5. Start the frontend from the project root:

   ```bash
   npm install
   npm run dev
   ```

Vite proxies `/api` to `http://localhost:3001`. Local sessions reset when the API server restarts.

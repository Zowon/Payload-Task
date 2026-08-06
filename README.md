# payload-task

Payload CMS 3.x take-home assignment built with Next.js App Router and SQLite.

## Stack

- [Payload CMS 3.x](https://payloadcms.com/docs)
- Next.js 15 App Router
- TypeScript
- SQLite (`@payloadcms/db-sqlite`)

## Getting started

```bash
cp .env.example .env   # already done — .env is included for local dev
npm install
npm run dev
```

Open [http://localhost:3000/admin](http://localhost:3000/admin) to access the Payload admin panel.
On first run you will be prompted to create an admin user.

## Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite connection string, e.g. `file:./payload-task.db` |
| `PAYLOAD_SECRET` | Secret key used to sign JWTs — keep this private |

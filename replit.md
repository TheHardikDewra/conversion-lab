# Conversion Lab

Paste a landing page URL, get a scored CRO teardown with ranked findings, fixes,
and stronger copy.

## Running it

Press **Run**. Nothing needs configuring. The app boots on port 5000 with six
real sample audits already loaded, so you land in a populated product rather
than an empty state.

## Turning on the copy layer

The audit itself is 35 deterministic checks that need no credentials. To also
get a written verdict and three rewrites for each headline, subhead and CTA:

1. Open the **Secrets** tool in the left sidebar
2. Add `ANTHROPIC_API_KEY` with your key from console.anthropic.com
3. Re-run any audit

The dashboard tells you which mode you are in.

## Adding a database (optional)

Open the **Database** tool and create a Postgres database. Replit sets
`DATABASE_URL` for you. Then run in the Shell:

```
npm run db:push
```

Restart. Audits now persist across restarts. Without it everything lives in
memory, which is fine for trying the template out.

## Publishing

Press **Publish**. The port mapping and build commands are already set in
`.replit`. On the Starter plan you get one published app with a "Made with
Replit" badge.

## Where to start editing

| I want to... | Open |
|---|---|
| Change what gets checked | `server/analyzer/rules.ts` |
| Change how much each category counts | The `/rubric` screen, no code |
| Rebrand the whole app | `client/src/index.css` |
| Add a new fact for rules to read | `server/analyzer/extract.ts` |
| Change a screen | `client/src/pages/` |

Full detail in `README.md`.

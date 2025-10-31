# ScopeLock

ScopeLock is a monorepo that bundles the static site, proof generation utilities, agent tooling, and project playbooks. This repository starts as a lightweight membrane that future work can grow from.

## Getting started

Install dependencies and build the site:

```bash
npm install
npm run build
```

Generate the proof bundle:

```bash
make proof
```

The proof bundle is written to `public/proof` and contains an index page with the generated entries.

## Repository layout

- `app/` — static site source assets.
- `proofgen/` — proof generation configuration and inputs.
- `agents/reader/` — reader agent stubs and assets.
- `playbooks/` — operational playbooks and documentation.
- `sprints/` — planning artifacts.
- `.github/workflows/` — automation pipelines for continuous integration.
- `scripts/` — helper scripts for build and proof generation tasks.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

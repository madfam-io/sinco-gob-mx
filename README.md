# Interactive SINCO 2019 Data Visualization 📊

This project is a single-page web application that provides an interactive visualization of Mexico's **Sistema Nacional de Clasificación de Ocupaciones (SINCO) 2019**.

## Deploy on Vercel

- Static app built by Vite to `dist/`
- Public assets are served at the root (/), e.g. `/sincoData.json`

Vercel config:

```
vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "rewrites": [{ "source": "/", "destination": "/index.html" }]
}
```

Scripts:

- npm run dev # local dev server
- npm run build # static build to dist
- npm run preview # preview the built site

If you see 404s on production, ensure requests use absolute root paths (e.g., `/sincoData.json`, `/i18n/en.json`).

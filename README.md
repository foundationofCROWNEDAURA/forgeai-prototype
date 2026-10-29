# ForgeAI prototype

ForgeAI is an initial working prototype for an AI website and web-app builder.

## What is included

- Responsive dark UI for desktop, tablet, and phone layouts
- Project dashboard with create, rename, open, and delete flows
- Prompt input for website description and generation actions
- Live preview and editable code workspace
- Saving to browser storage so projects restore when the page reloads
- Publishing status messaging that clearly explains when configuration is required
- Secure-by-default notes for AI credentials and untrusted generated code

## Important limitation

This prototype does not connect to a real AI provider by default. The built-in Generate action will not pretend an AI model is connected unless it is configured on a secure backend. The app intentionally shows clear warnings instead of fake success states.

## Run locally

You can open `index.html` directly in a browser, or serve the folder locally:

```bash
cd forgeai-prototype
python3 -m http.server 4173
```

Then visit:

```text
http://localhost:4173/
```

## Add a real AI engine securely

Use a backend endpoint that keeps API keys server-side. Example pattern:

1. Create a small server or serverless function.
2. Store your key in environment variables only.
3. Call the AI model from the backend.
4. Return the generated HTML, CSS, and JavaScript in a structured JSON response.

Minimal backend contract:

```json
{
  "project": {
    "html": "...",
    "css": "...",
    "js": "..."
  }
}
```

### Example secure backend idea

Create a file such as `api/generate.js` and configure it to call OpenAI or another provider using `process.env.OPENAI_API_KEY`.

```js
export default async function handler(req, res) {
  const { prompt } = req.body || {};

  if (!prompt) {
    return res.status(400).json({ error: 'A prompt is required.' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'AI model not configured on the backend.' });
  }

  // Use your model here and return project HTML/CSS/JS.
  res.status(200).json({
    project: {
      html: '<section>Hello</section>',
      css: 'body { font-family: sans-serif; }',
      js: 'console.log("Generated from secure backend")'
    }
  });
}
```

## GitHub Pages deployment

This prototype is static and works well with GitHub Pages for the initial front-end deployment.

1. Push the repo to GitHub.
2. In GitHub, open the repository.
3. Go to Settings → Pages.
4. Choose the main branch and the root folder `/`.
5. Save.

The site will be published to a URL similar to:

```text
https://<username>.github.io/forgeai-prototype/
```

## Publishing notes

- Publishing a static front-end is possible on GitHub Pages.
- Real AI generation, user accounts, database-backed projects, and backend logic require a secure backend and additional services.
- Do not claim a public URL is live unless the deployment actually succeeds.
- Never expose API keys in browser JavaScript.

## Security and safety checklist

- Keep API keys and credentials on the server only.
- Validate prompt input and generated project code before execution.
- Treat generated code as untrusted and isolate it in an iframe sandbox.
- Protect private projects and user data behind authentication and authorization.

## Suggested next steps

1. Add a secure backend endpoint for AI generation.
2. Add a database for user accounts and saved projects.
3. Add authentication and project ownership.
4. Connect deployment automation for public URLs.
5. Add automated testing and mobile QA.

## Testing and quality checks

Before calling a feature production-ready, verify:

- Buttons work on mobile and desktop.
- Project save/restore works after reload.
- Preview updates when the editor changes.
- Error messages appear for missing backend configuration.
- Publishing status is only shown after a successful deployment.

## License

MIT

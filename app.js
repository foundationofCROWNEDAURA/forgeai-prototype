const STORAGE_KEY = 'forgeai-projects-v1';
const AI_CONFIG = {
  enabled: false,
  apiPath: '/api/generate',
};

const defaultProject = {
  id: null,
  name: 'Untitled project',
  prompt: '',
  html: `
    <section class="hero">
      <div class="hero-copy">
        <span class="kicker">ForgeAI starter</span>
        <h1>Build beautiful digital experiences.</h1>
        <p>
          A clean, modern landing page concept with clear messaging, a strong CTA, and a responsive layout.
        </p>
        <div class="cta-row">
          <button>Get started</button>
          <button class="ghost">View demo</button>
        </div>
      </div>
      <div class="hero-card">
        <div class="mini-chart">
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div class="metrics">
          <div>
            <strong>82%</strong>
            <small>Conversion lift</small>
          </div>
          <div>
            <strong>4.9/5</strong>
            <small>Customer love</small>
          </div>
        </div>
      </div>
    </section>
  `,
  css: `
    :root {
      --bg: #0a0d12;
      --panel: #121821;
      --text: #f6f7fb;
      --muted: #aab4c8;
      --purple: #8b5cf6;
      --purple-strong: #7c3aed;
      --border: rgba(255,255,255,0.12);
    }

    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: linear-gradient(180deg, #070a0f, #0d1118);
      color: var(--text);
    }
    .hero {
      min-height: 100vh;
      display: grid;
      grid-template-columns: 1.5fr 1fr;
      align-items: center;
      padding: 60px 7vw;
      gap: 30px;
    }
    .kicker {
      display: inline-block;
      padding: 8px 12px;
      border-radius: 999px;
      background: rgba(139, 92, 246, 0.18);
      color: #d7ccff;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    h1 {
      font-size: clamp(2.6rem, 4vw, 4.5rem);
      line-height: 1.1;
      margin: 20px 0 16px;
      max-width: 560px;
    }
    p {
      color: var(--muted);
      font-size: 1.08rem;
      line-height: 1.7;
      max-width: 620px;
    }
    .cta-row {
      display: flex;
      gap: 12px;
      margin-top: 28px;
      flex-wrap: wrap;
    }
    button {
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, var(--purple), var(--purple-strong));
      color: white;
      padding: 14px 20px;
      font-weight: 700;
      cursor: pointer;
    }
    .ghost {
      background: transparent;
      border: 1px solid var(--border);
      color: var(--text);
    }
    .hero-card {
      border: 1px solid var(--border);
      border-radius: 20px;
      background: rgba(255,255,255,0.02);
      padding: 30px;
      box-shadow: 0 25px 60px rgba(12, 17, 25, 0.5);
    }
    .mini-chart {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      height: 180px;
      margin-bottom: 26px;
    }
    .mini-chart span {
      flex: 1;
      border-radius: 12px 12px 0 0;
      background: linear-gradient(180deg, #a78bfa, #8b5cf6);
    }
    .mini-chart span:nth-child(1) { height: 35%; }
    .mini-chart span:nth-child(2) { height: 52%; }
    .mini-chart span:nth-child(3) { height: 76%; }
    .mini-chart span:nth-child(4) { height: 100%; }
    .metrics {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .metrics div {
      border: 1px solid var(--border);
      background: rgba(255,255,255,0.02);
      padding: 16px;
      border-radius: 14px;
    }
    .metrics strong {
      display: block;
      font-size: 1.2rem;
      margin-bottom: 6px;
    }
    .metrics small {
      color: var(--muted);
    }
    @media (max-width: 700px) {
      .hero {
        grid-template-columns: 1fr;
        padding-top: 40px;
      }
    }
  `,
  js: `
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('button').forEach((button) => {
        button.addEventListener('click', () => {
          const label = button.textContent.trim();
          window.alert(label + ' clicked. This is a prototype action.');
        });
      });
    });
  `,
  updatedAt: Date.now(),
  createdAt: Date.now(),
};

const state = {
  projects: [],
  activeProjectId: null,
};

const els = {
  projectList: document.getElementById('projectList'),
  promptInput: document.getElementById('promptInput'),
  activeProjectName: document.getElementById('activeProjectName'),
  saveStatusBadge: document.getElementById('saveStatusBadge'),
  generationStatus: document.getElementById('generationStatus'),
  modelStatusPill: document.getElementById('modelStatusPill'),
  previewFrame: document.getElementById('previewFrame'),
  codeEditor: document.getElementById('codeEditor'),
  generateBtn: document.getElementById('generateBtn'),
  saveBtn: document.getElementById('saveBtn'),
  publishBtn: document.getElementById('publishBtn'),
  starterBtn: document.getElementById('starterBtn'),
  newProjectBtn: document.getElementById('newProjectBtn'),
  sidebarNewProjectBtn: document.getElementById('sidebarNewProjectBtn'),
  regenerateSectionBtn: document.getElementById('regenerateSectionBtn'),
  copyCodeBtn: document.getElementById('copyCodeBtn'),
};

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    state.projects = Array.isArray(parsed) && parsed.length ? parsed : [createProjectTemplate()];
    state.activeProjectId = state.projects[0].id;
  } catch (error) {
    console.error('Failed to load projects:', error);
    state.projects = [createProjectTemplate()];
    state.activeProjectId = state.projects[0].id;
  }
}

function createProjectTemplate(name = 'Untitled project') {
  return {
    ...defaultProject,
    id: crypto.randomUUID(),
    name,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.projects));
}

function getActiveProject() {
  return state.projects.find((project) => project.id === state.activeProjectId) || state.projects[0];
}

function setStatus(message, tone = 'default') {
  els.generationStatus.textContent = message;
  els.generationStatus.className = 'status-box';

  if (tone === 'warning') {
    els.generationStatus.classList.add('warning');
  }

  if (tone === 'error') {
    els.generationStatus.classList.add('error');
  }

  if (tone === 'success') {
    els.generationStatus.classList.add('success');
  }
}

function updateModelPill() {
  const isConnected = AI_CONFIG.enabled;
  const pill = els.modelStatusPill;
  const dot = pill.querySelector('.dot');

  if (isConnected) {
    pill.innerHTML = '<span class="dot" style="background:#22c55e; box-shadow:0 0 12px rgba(34,197,94,0.8)"></span>AI model connected';
  } else {
    pill.innerHTML = '<span class="dot" style="background:#ef4444; box-shadow:0 0 12px rgba(239,68,68,0.8)"></span>AI model offline';
  }
}

function renderProjects() {
  els.projectList.innerHTML = '';

  state.projects.forEach((project) => {
    const card = document.createElement('article');
    card.className = `project-card ${project.id === state.activeProjectId ? 'active' : ''}`;

    const head = document.createElement('div');
    head.className = 'project-card-head';

    const info = document.createElement('div');
    info.innerHTML = `
      <div class="project-name">${escapeHtml(project.name)}</div>
      <div class="project-meta">${new Date(project.updatedAt).toLocaleDateString()}</div>
    `;

    const saveState = document.createElement('span');
    saveState.className = 'badge neutral';
    saveState.textContent = project.saved ? 'Saved' : 'Draft';

    head.append(info, saveState);

    const actions = document.createElement('div');
    actions.className = 'project-card-actions';

    const openBtn = document.createElement('button');
    openBtn.type = 'button';
    openBtn.className = 'card-action';
    openBtn.textContent = 'Open';
    openBtn.addEventListener('click', () => {
      state.activeProjectId = project.id;
      renderAll();
    });

    const renameBtn = document.createElement('button');
    renameBtn.type = 'button';
    renameBtn.className = 'card-action';
    renameBtn.textContent = 'Rename';
    renameBtn.addEventListener('click', () => {
      renameProject(project.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'card-action delete';
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
      deleteProject(project.id);
    });

    actions.append(openBtn, renameBtn, deleteBtn);
    card.append(head, actions);
    els.projectList.append(card);
  });
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function syncEditorAndPreview() {
  const project = getActiveProject();
  if (!project) return;

  els.promptInput.value = project.prompt ?? '';
  els.activeProjectName.textContent = project.name;
  els.codeEditor.value = buildProjectCode(project);
  els.saveStatusBadge.textContent = project.saved ? 'Saved' : 'Unsaved';
  els.saveStatusBadge.className = 'badge neutral';

  const combined = buildFullDocument(project.html, project.css, project.js);
  els.previewFrame.srcdoc = combined;
}

function buildProjectCode(project) {
  return `<!-- HTML -->\n${project.html}\n\n<style>\n${project.css}\n</style>\n\n<script>\n${project.js}\n<\/script>`;
}

function buildFullDocument(html, css, js) {
  return `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <style>${css}</style>
      </head>
      <body>
        ${html}
        <script>${js}<\/script>
      </body>
    </html>`;
}

function renderAll() {
  renderProjects();
  syncEditorAndPreview();
}

function createProject() {
  const project = createProjectTemplate('New project');
  state.projects.unshift(project);
  state.activeProjectId = project.id;
  saveProjects();
  renderAll();
  setStatus('New project created. Add a prompt or edit the starter code.', 'success');
}

function renameProject(projectId) {
  const project = state.projects.find((entry) => entry.id === projectId);
  if (!project) return;

  const nextName = window.prompt('Rename project', project.name);
  if (nextName && nextName.trim()) {
    project.name = nextName.trim();
    project.updatedAt = Date.now();
    project.saved = false;
    saveProjects();
    renderAll();
    setStatus(`Project renamed to “${project.name}”.`, 'success');
  }
}

function deleteProject(projectId) {
  if (state.projects.length === 1) {
    const confirmed = window.confirm('This is your last project. Create a replacement before deleting it?');
    if (!confirmed) return;
  }

  const shouldDelete = window.confirm('Delete this project permanently?');
  if (!shouldDelete) return;

  state.projects = state.projects.filter((project) => project.id !== projectId);
  if (state.projects.length === 0) {
    const replacement = createProjectTemplate('Untitled project');
    state.projects.push(replacement);
  }

  state.activeProjectId = state.projects[0].id;
  saveProjects();
  renderAll();
  setStatus('Project deleted. The dashboard was updated.', 'warning');
}

function saveProject() {
  const project = getActiveProject();
  if (!project) return;

  project.prompt = els.promptInput.value.trim();
  const sourceCode = els.codeEditor.value;
  const { html, css, js } = parseCodeEditor(sourceCode);
  project.html = html;
  project.css = css;
  project.js = js;
  project.updatedAt = Date.now();
  project.saved = true;

  saveProjects();
  renderAll();
  setStatus('Project saved successfully.', 'success');
}

function parseCodeEditor(code) {
  const htmlMatch = code.match(/<!-- HTML -->\s*([\s\S]*?)(?=\s*<style>|$)/);
  const cssMatch = code.match(/<style>([\s\S]*?)<\/style>/);
  const jsMatch = code.match(/<script>([\s\S]*?)<\/script>/);

  const html = htmlMatch ? htmlMatch[1].trim() : '';
  const css = cssMatch ? cssMatch[1].trim() : '';
  const js = jsMatch ? jsMatch[1].trim() : '';

  return { html, css, js };
}

function createStarterProjectFromPrompt(promptText) {
  const text = (promptText || '').trim();
  const title = text ? text.split(' ').slice(0, 6).join(' ') || 'Launch page' : 'Launch page';

  const html = `
    <main class="starter-page">
      <section class="hero-section">
        <nav class="topbar-nav">
          <div class="logo">${escapeHtml(title)}</div>
          <div class="nav-links">
            <span>Features</span>
            <span>Pricing</span>
            <span>About</span>
          </div>
          <button>Book demo</button>
        </nav>

        <div class="content-wrap">
          <div>
            <p class="eyebrow">Built for growth</p>
            <h1>${escapeHtml(title)}</h1>
            <p class="lede">A polished concept generated from your prompt and adapted to a responsive layout.</p>
            <div class="cta-row">
              <button>Start free</button>
              <button class="ghost">See pricing</button>
            </div>
          </div>
          <div class="feature-box">
            <h3>What you get</h3>
            <ul>
              <li>Fast onboarding</li>
              <li>Responsive layout</li>
              <li>User-friendly flow</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  `;

  const css = `
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #0b0d12;
      color: #f5f7ff;
    }
    .starter-page {
      min-height: 100vh;
      background: linear-gradient(180deg, #0d1118 0%, #121924 100%);
      padding: 24px;
    }
    .hero-section {
      max-width: 1180px;
      margin: 0 auto;
      border: 1px solid rgba(255,255,255,0.12);
      background: rgba(255,255,255,0.02);
      border-radius: 28px;
      padding: 18px 20px 32px;
    }
    .topbar-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      padding: 10px 6px 20px;
    }
    .logo {
      font-weight: 800;
      letter-spacing: 0.04em;
    }
    .nav-links {
      display: flex;
      gap: 20px;
      color: #a7afc8;
      font-size: 0.9rem;
    }
    button {
      border: none;
      border-radius: 12px;
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
      color: white;
      padding: 12px 16px;
      font-weight: 700;
      cursor: pointer;
    }
    .ghost {
      background: transparent;
      border: 1px solid rgba(255,255,255,0.14);
    }
    .content-wrap {
      display: grid;
      grid-template-columns: 1.5fr 0.8fr;
      gap: 24px;
      align-items: center;
      padding: 36px 8px 8px;
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #c4b5fd;
      font-size: 0.7rem;
      margin-bottom: 16px;
    }
    h1 {
      margin: 0;
      font-size: clamp(2.5rem, 5vw, 4.3rem);
      line-height: 1.1;
      max-width: 470px;
    }
    .lede {
      color: #a7afc8;
      font-size: 1.05rem;
      line-height: 1.7;
      max-width: 620px;
      margin-top: 18px;
    }
    .cta-row {
      display: flex;
      gap: 12px;
      margin-top: 26px;
      flex-wrap: wrap;
    }
    .feature-box {
      background: rgba(139, 92, 246, 0.08);
      border: 1px solid rgba(139, 92, 246, 0.42);
      border-radius: 22px;
      padding: 24px;
    }
    .feature-box h3 {
      margin-top: 0;
    }
    .feature-box ul {
      margin: 0;
      padding-left: 18px;
      color: #dfe7ff;
      line-height: 2;
    }
    @media (max-width: 760px) {
      .topbar-nav,
      .content-wrap {
        grid-template-columns: 1fr;
        display: grid;
      }
      .nav-links {
        display: none;
      }
      .topbar-nav {
        padding-bottom: 10px;
      }
      .feature-box {
        margin-top: 8px;
      }
    }
  `;

  const js = `
    document.addEventListener('DOMContentLoaded', () => {
      const buttons = document.querySelectorAll('button');
      buttons.forEach((button) => {
        button.addEventListener('click', () => {
          button.classList.toggle('is-active');
        });
      });
    });
  `;

  return { html, css, js };
}

function useStarterTemplate() {
  const project = getActiveProject();
  if (!project) return;

  const generated = createStarterProjectFromPrompt(els.promptInput.value);
  project.html = generated.html;
  project.css = generated.css;
  project.js = generated.js;
  project.prompt = els.promptInput.value.trim();
  project.updatedAt = Date.now();
  project.saved = false;

  saveProjects();
  renderAll();
  setStatus('Starter template loaded. This is a local fallback only and is not an AI-generated site.', 'warning');
}

async function generateProject() {
  const project = getActiveProject();
  if (!project) return;

  const prompt = els.promptInput.value.trim();
  if (!prompt) {
    setStatus('Add a website description before generating.', 'error');
    return;
  }

  project.prompt = prompt;
  project.updatedAt = Date.now();
  project.saved = false;
  saveProjects();

  if (!AI_CONFIG.enabled) {
    setStatus(
      'No AI model is connected. A secure backend is required before real AI generation can happen. Use the starter template or configure the server-side model.',
      'warning'
    );
    return;
  }

  setStatus('Generating your project with the connected model...', 'default');

  try {
    const response = await fetch(AI_CONFIG.apiPath, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, projectId: project.id }),
    });

    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Unknown server error' }));
      throw new Error(body.error || 'AI generation failed');
    }

    const payload = await response.json();
    const result = payload.code || payload.project || null;

    if (!result || !result.html || !result.css || !result.js) {
      throw new Error('AI response did not include usable project code.');
    }

    project.html = result.html;
    project.css = result.css;
    project.js = result.js;
    project.saved = false;
    project.updatedAt = Date.now();

    saveProjects();
    renderAll();
    setStatus('Your project was generated successfully.', 'success');
  } catch (error) {
    console.error('AI generation error:', error);
    setStatus(`Generation failed: ${error.message}. Check the backend connection and try again.`, 'error');
  }
}

function publishProject() {
  const project = getActiveProject();
  if (!project) return;

  setStatus('Publishing is not available in this initial prototype. It requires a hosting account, backend configuration, and deployment credentials.', 'warning');
}

function copyCode() {
  const code = els.codeEditor.value;
  navigator.clipboard.writeText(code)
    .then(() => setStatus('Code copied to your clipboard.', 'success'))
    .catch(() => setStatus('Clipboard access failed. Copy the code manually.', 'error'));
}

function regenerateSection() {
  setStatus('Section regeneration is ready for a connected AI backend. Configure it to enable automated section revisions.', 'warning');
}

function bindEvents() {
  els.generateBtn.addEventListener('click', generateProject);
  els.saveBtn.addEventListener('click', saveProject);
  els.starterBtn.addEventListener('click', useStarterTemplate);
  els.publishBtn.addEventListener('click', publishProject);
  els.newProjectBtn.addEventListener('click', createProject);
  els.sidebarNewProjectBtn.addEventListener('click', createProject);
  els.regenerateSectionBtn.addEventListener('click', regenerateSection);
  els.copyCodeBtn.addEventListener('click', copyCode);

  document.querySelectorAll('.tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const selected = tab.dataset.tab;
      document.querySelectorAll('.tab').forEach((button) => {
        const isActive = button === tab;
        button.classList.toggle('active', isActive);
        button.setAttribute('aria-selected', String(isActive));
      });

      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('active', panel.id === `${selected}Panel`);
      });
    });
  });

  els.codeEditor.addEventListener('input', () => {
    const project = getActiveProject();
    if (!project) return;
    project.saved = false;
    els.saveStatusBadge.textContent = 'Unsaved';
  });

  els.promptInput.addEventListener('input', () => {
    const project = getActiveProject();
    if (!project) return;
    project.prompt = els.promptInput.value.trim();
    project.saved = false;
    els.saveStatusBadge.textContent = 'Unsaved';
  });
}

function initialize() {
  loadProjects();
  updateModelPill();
  bindEvents();
  renderAll();
  setStatus('No AI model is connected. Add a secure backend before generating live AI sites.', 'warning');
}

initialize();

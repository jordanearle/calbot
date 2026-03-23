import express from 'express';
import type { Request, Response } from 'express';
import { existsSync, mkdirSync, writeFileSync, readFileSync, statSync, readdirSync } from 'fs';
import { join } from 'path';
import { randomBytes, randomUUID } from 'crypto';
import {
  runCommand,
  getCalbotDir,
  getProjects,
  findAvailablePort,
} from '../utils/shell.js';
import {
  getRunningPrototypes,
  launchPrototypeServer,
  stopRunningPrototype,
} from '../utils/running.js';
import {
  getBirdieGlobalsCss,
  getBirdieTailwindConfig,
  getBirdieLayoutTsx,
  getBirdiePageTsx,
  getBirdieNavComponents,
  getComponentsJson,
  getLibUtils,
  getClaudeMd,
  getMcpJson,
} from '../templates/birdie/index.js';
import { getDashboardHtml } from './ui.js';

// In-memory map of projects currently being created
const pendingCreations = new Map<string, { name: string; startedAt: string; description?: string }>();

// Progress tracking per project
interface ProjectProgress {
  steps: Array<{ label: string; status: 'pending' | 'running' | 'done' }>;
  done: boolean;
  error?: string;
}
const pendingProgress = new Map<string, ProjectProgress>();

const CREATION_STEPS = [
  'Creating Next.js app',
  'Installing UI components',
  'Applying Birdie design system',
  'Building layout',
  'Final install',
  'Starting dev server',
];

function initProgress(name: string) {
  pendingProgress.set(name, {
    steps: CREATION_STEPS.map((label, i) => ({ label, status: i === 0 ? 'running' : 'pending' })),
    done: false,
  });
}

function advanceProgress(name: string, nextStepIndex: number) {
  const p = pendingProgress.get(name);
  if (!p) return;
  p.steps = p.steps.map((s, i) => ({
    ...s,
    status: i < nextStepIndex ? 'done' : i === nextStepIndex ? 'running' : 'pending',
  }));
}

function completeProgress(name: string, error?: string) {
  const p = pendingProgress.get(name);
  if (!p) return;
  if (error) {
    p.error = error;
  } else {
    p.steps = p.steps.map(s => ({ ...s, status: 'done' as const }));
    p.done = true;
  }
}

function toNpmSafeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-_.]/g, '')
    .replace(/^[-_.]+/, '')
    .replace(/[-_.]+$/, '')
    .replace(/-+/g, '-');
}

function buildContextMd(description?: string): string {
  const descSection = description
    ? `## What to Build\n${description}\n\n`
    : '';

  return `# Prototype Context

${descSection}## Product Area
_What part of the product does this prototype explore?_


## Primary Users
_Who is the target audience for this feature?_


## Core Job
_What job-to-be-done does this solve for users?_


## Constraints
_Technical, design, or business constraints to keep in mind_


## Risks
_What could go wrong? What assumptions need validation?_

`;
}


async function createProjectHeadless(name: string, description?: string): Promise<void> {
  initProgress(name);
  const calbotDir = getCalbotDir();
  const projPath = join(calbotDir, name);

  try {
    if (!existsSync(calbotDir)) {
      mkdirSync(calbotDir, { recursive: true });
    }

    // Step 1: Create Next.js app
    const createResult = await runCommand(
      'npx',
      [
        '--yes', 'create-next-app@latest', name,
        '--yes', '--typescript', '--tailwind', '--eslint',
        '--app', '--src-dir', '--import-alias', '@/*',
        '--use-npm', '--no-turbopack',
      ],
      { cwd: calbotDir }
    );

    if (!createResult.success) {
      throw new Error('Failed to create Next.js app: ' + createResult.error);
    }

    // Write meta files
    const calbotMetaDir = join(projPath, '.calbot');
    mkdirSync(calbotMetaDir, { recursive: true });
    writeFileSync(join(projPath, 'CLAUDE.md'), getClaudeMd());
    writeFileSync(join(projPath, '.mcp.json'), getMcpJson());
    writeFileSync(join(projPath, 'context.md'), buildContextMd(description));
    writeFileSync(join(calbotMetaDir, 'notes.md'), '');

    advanceProgress(name, 1); // → Installing UI components

    // Step 2: shadcn/ui
    writeFileSync(join(projPath, 'components.json'), getComponentsJson());
    mkdirSync(join(projPath, 'src', 'lib'), { recursive: true });
    writeFileSync(join(projPath, 'src', 'lib', 'utils.ts'), getLibUtils());

    await runCommand(
      'npm',
      ['install', 'class-variance-authority', 'clsx', 'tailwind-merge', 'lucide-react', '@radix-ui/react-slot', 'agentation'],
      { cwd: projPath }
    );
    await runCommand(
      'npx',
      ['--yes', 'shadcn@latest', 'add', 'button', 'card', 'input', 'avatar', '-y', '--overwrite'],
      { cwd: projPath }
    );

    advanceProgress(name, 2); // → Applying Birdie design system

    // Step 3: Birdie design tokens
    writeFileSync(join(projPath, 'src', 'app', 'globals.css'), getBirdieGlobalsCss());
    writeFileSync(join(projPath, 'tailwind.config.ts'), getBirdieTailwindConfig());

    advanceProgress(name, 3); // → Building layout

    // Step 4: Layout
    mkdirSync(join(projPath, 'src', 'components', 'layout'), { recursive: true });
    const navComponents = getBirdieNavComponents();
    writeFileSync(join(projPath, 'src', 'components', 'layout', 'TopNav.tsx'), navComponents.topNav);
    writeFileSync(join(projPath, 'src', 'components', 'layout', 'SideNav.tsx'), navComponents.sideNav);
    writeFileSync(join(projPath, 'src', 'app', 'layout.tsx'), getBirdieLayoutTsx());
    writeFileSync(join(projPath, 'src', 'app', 'page.tsx'), getBirdiePageTsx(name));

    advanceProgress(name, 4); // → Final install

    // Step 5: Final install
    await runCommand('npm', ['install'], { cwd: projPath });

    advanceProgress(name, 5); // → Starting dev server

    // Step 6: Start dev server
    const port = await findAvailablePort(3000);
    const projectId = randomUUID();
    const createdAt = new Date().toISOString();
    const token = randomBytes(32).toString('hex');

    writeFileSync(
      join(calbotMetaDir, 'state.json'),
      JSON.stringify({
        projectId,
        projectName: name,
        templateId: 'birdie',
        createdAt,
        runtime: {
          devServerUrl: 'http://127.0.0.1:' + port,
          devServerPort: port,
          nodeVersion: process.version,
          packageManager: 'npm',
        },
        ux: { lastViewedPath: '/', lastActionAt: createdAt, selection: null },
        safety: { runnerPid: process.pid, runnerVersion: '1.0.0' },
        claude: { preferredOpenMode: 'claude_cli' },
      }, null, 2)
    );

    launchPrototypeServer({
      projectName: name,
      projectPath: projPath,
      port,
      env: {
        CALBOT_LOCAL_RUNNER: '1',
        CALBOT_TOKEN: token,
        CALBOT_PROJECT_ROOT: projPath,
        CALBOT_PROJECT_ID: projectId,
        CALBOT_PROJECT_NAME: name,
        CALBOT_TEMPLATE_ID: 'birdie',
        CALBOT_DEV_SERVER_PORT: String(port),
        CALBOT_DEV_SERVER_URL: 'http://127.0.0.1:' + port,
        CALBOT_CREATED_AT: createdAt,
      },
    });

    completeProgress(name);

  } catch (err) {
    completeProgress(name, (err as Error).message);
    throw err;
  } finally {
    pendingCreations.delete(name);
  }
}

function getLastModified(projectPath: string): Date {
  // Check a few key files as proxies for "last edited"
  const candidates = [
    join(projectPath, 'src', 'app', 'page.tsx'),
    join(projectPath, 'src', 'app'),
    join(projectPath, '.calbot', 'state.json'),
    projectPath,
  ];
  let latest = new Date(0);
  for (const p of candidates) {
    try {
      const mtime = statSync(p).mtime;
      if (mtime > latest) latest = mtime;
    } catch { /* ignore */ }
  }
  return latest;
}

function nextAvailableName(baseName: string, existingNames: string[]): string {
  if (!existingNames.includes(baseName)) return baseName;
  let i = 2;
  while (existingNames.includes(`${baseName}-${i}`)) i++;
  return `${baseName}-${i}`;
}

function buildRunnerEnv(project: { name: string; path: string }, port: number): Record<string, string> {
  const statePath = join(project.path, '.calbot', 'state.json');
  let stored: { projectId?: string; templateId?: string; createdAt?: string } = {};
  if (existsSync(statePath)) {
    try { stored = JSON.parse(readFileSync(statePath, 'utf-8')); } catch { /* ignore */ }
  }
  return {
    CALBOT_LOCAL_RUNNER: '1',
    CALBOT_TOKEN: randomBytes(32).toString('hex'),
    CALBOT_PROJECT_ROOT: project.path,
    CALBOT_PROJECT_ID: stored.projectId ?? project.name,
    CALBOT_PROJECT_NAME: project.name,
    CALBOT_TEMPLATE_ID: stored.templateId ?? 'birdie',
    CALBOT_DEV_SERVER_PORT: String(port),
    CALBOT_DEV_SERVER_URL: 'http://127.0.0.1:' + port,
    CALBOT_CREATED_AT: stored.createdAt ?? new Date().toISOString(),
  };
}

export async function startDashboardServer(port: number): Promise<void> {
  const app = express();
  app.use(express.json());

  // Serve the dashboard UI
  app.get('/', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(getDashboardHtml());
  });

  // GET /api/state — project list + running status + pending creations
  app.get('/api/state', (_req: Request, res: Response) => {
    try {
      const projects = getProjects();
      const running = getRunningPrototypes();
      const pendingNames = new Set(pendingCreations.keys());

      const enriched = projects
        .filter(p => !pendingNames.has(p.name))
        .map(p => {
          const runningEntry = running.find(r => r.name === p.name);
          return {
            name: p.name,
            path: p.path,
            createdAt: p.createdAt.toISOString(),
            lastModified: getLastModified(p.path).toISOString(),
            running: Boolean(runningEntry),
            port: runningEntry?.port ?? null,
            pid: runningEntry?.pid ?? null,
            creating: false,
          };
        });

      res.json({
        projects: enriched,
        pendingCreations: Array.from(pendingCreations.values()),
        calbotDir: getCalbotDir(),
      });
    } catch (err) {
      console.error('[calbot dashboard] /api/state error:', err);
      res.status(500).json({ projects: [], pendingCreations: [], calbotDir: getCalbotDir(), error: (err as Error).message });
    }
  });

  // POST /api/projects — create a new prototype
  app.post('/api/projects', (req: Request, res: Response) => {
    const { name, description } = req.body as { name?: string; description?: string };

    if (!name) {
      res.status(400).json({ error: 'Project name is required.' });
      return;
    }

    const safeName = toNpmSafeName(name);
    if (!safeName) {
      res.status(400).json({ error: 'Invalid project name. Use lowercase letters and dashes.' });
      return;
    }

    const projPath = join(getCalbotDir(), safeName);
    if (existsSync(projPath)) {
      res.status(409).json({ error: 'A prototype called "' + safeName + '" already exists.' });
      return;
    }

    if (pendingCreations.has(safeName)) {
      res.status(409).json({ error: '"' + safeName + '" is already being created.' });
      return;
    }

    pendingCreations.set(safeName, {
      name: safeName,
      startedAt: new Date().toISOString(),
      description,
    });

    // Run creation in the background
    createProjectHeadless(safeName, description).catch(err => {
      console.error('[calbot dashboard] Error creating project:', err);
      pendingCreations.delete(safeName);
    });

    res.status(202).json({ status: 'creating', name: safeName });
  });

  // POST /api/projects/:name/start — start dev server for a project
  app.post('/api/projects/:name/start', async (req: Request, res: Response) => {
    const { name } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.name === name);

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const running = getRunningPrototypes();
    if (running.find(r => r.name === name)) {
      res.status(409).json({ error: 'Already running.' });
      return;
    }

    try {
      const port = await findAvailablePort(3000);
      const env = buildRunnerEnv(project, port);
      launchPrototypeServer({ projectName: name, projectPath: project.path, port, env });
      res.json({ status: 'started', port });
    } catch (err) {
      res.status(500).json({ error: 'Failed to start server: ' + (err as Error).message });
    }
  });

  // POST /api/projects/:name/duplicate — copy a prototype to a new folder
  app.post('/api/projects/:name/duplicate', async (req: Request, res: Response) => {
    const { name } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.name === name);

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    const existingNames = projects.map(p => p.name);
    const newName = nextAvailableName(name, existingNames);
    const newPath = join(getCalbotDir(), newName);

    try {
      // Copy the directory
      await runCommand('cp', ['-r', project.path, newPath]);

      // Give the copy a fresh identity
      const statePath = join(newPath, '.calbot', 'state.json');
      if (existsSync(statePath)) {
        const stored = JSON.parse(readFileSync(statePath, 'utf-8'));
        stored.projectId = randomUUID();
        stored.projectName = newName;
        stored.createdAt = new Date().toISOString();
        writeFileSync(statePath, JSON.stringify(stored, null, 2));
      }

      res.json({ status: 'duplicated', name: newName });
    } catch (err) {
      res.status(500).json({ error: 'Failed to duplicate: ' + (err as Error).message });
    }
  });

  // GET /api/progress/:name — live creation progress
  app.get('/api/progress/:name', (req: Request, res: Response) => {
    const { name } = req.params;
    const progress = pendingProgress.get(name);
    if (!progress) {
      res.json({ steps: [], done: true, notFound: true });
      return;
    }
    res.json(progress);
  });

  // POST /api/projects/:name/stop — stop a running dev server
  app.post('/api/projects/:name/stop', (req: Request, res: Response) => {
    const { name } = req.params;
    const running = getRunningPrototypes();
    const entry = running.find(r => r.name === name);

    if (!entry) {
      res.status(404).json({ error: 'Not running.' });
      return;
    }

    stopRunningPrototype(entry.pid);
    res.json({ status: 'stopped' });
  });

  // DELETE /api/projects/:name — delete a prototype
  app.delete('/api/projects/:name', async (req: Request, res: Response) => {
    const { name } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.name === name);

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    // Stop if running
    const running = getRunningPrototypes();
    const runningEntry = running.find(r => r.name === name);
    if (runningEntry) {
      stopRunningPrototype(runningEntry.pid);
    }

    try {
      await runCommand('rm', ['-rf', project.path]);
      res.json({ status: 'deleted' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete: ' + (err as Error).message });
    }
  });

  // POST /api/projects/:name/open-editor — open project in VS Code or Cursor
  app.post('/api/projects/:name/open-editor', async (req: Request, res: Response) => {
    const { name } = req.params;
    const projects = getProjects();
    const project = projects.find(p => p.name === name);

    if (!project) {
      res.status(404).json({ error: 'Project not found.' });
      return;
    }

    // Try Cursor first, then VS Code
    const cursor = await runCommand('which', ['cursor']);
    const editor = cursor.success ? 'cursor' : 'code';
    const result = await runCommand(editor, [project.path]);

    if (!result.success) {
      res.status(500).json({ error: 'No editor found. Install VS Code or Cursor.' });
      return;
    }

    res.json({ status: 'opened', editor });
  });

  await new Promise<void>((resolve, reject) => {
    const server = app.listen(port, () => resolve());
    server.on('error', reject);
  });

  console.log('\n  (•ᴗ•) calbot dashboard is running at http://localhost:' + port + '\n');
}

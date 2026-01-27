import { spawn } from 'child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getCalbotDir } from './shell.js';

export interface RunningPrototype {
  id: string;
  name: string;
  path: string;
  port: number;
  pid: number;
  startedAt: string;
}

interface LaunchOptions {
  projectName: string;
  projectPath: string;
  port: number;
  env?: Record<string, string>;
}

const RUNNING_STATE_FILE = join(getCalbotDir(), '.running.json');

function ensureStateFile() {
  const baseDir = getCalbotDir();
  if (!existsSync(baseDir)) {
    mkdirSync(baseDir, { recursive: true });
  }

  if (!existsSync(RUNNING_STATE_FILE)) {
    writeFileSync(RUNNING_STATE_FILE, '[]', 'utf-8');
  }
}

function readState(): RunningPrototype[] {
  try {
    ensureStateFile();
    const contents = readFileSync(RUNNING_STATE_FILE, 'utf-8');
    return JSON.parse(contents) as RunningPrototype[];
  } catch {
    return [];
  }
}

function writeState(items: RunningPrototype[]) {
  ensureStateFile();
  writeFileSync(RUNNING_STATE_FILE, JSON.stringify(items, null, 2));
}

function isProcessAlive(pid: number): boolean {
  if (!Number.isFinite(pid) || pid <= 0) {
    return false;
  }

  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    return err.code !== 'ESRCH';
  }
}

export function getRunningPrototypes(): RunningPrototype[] {
  const state = readState();
  const alive = state.filter((item) => isProcessAlive(item.pid));
  if (alive.length !== state.length) {
    writeState(alive);
  }

  return alive.sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
}

function removeRunningPrototypeByPid(pid: number) {
  const state = readState();
  const updated = state.filter((item) => item.pid !== pid);
  writeState(updated);
}

export function stopRunningPrototype(pid: number): boolean {
  let stopped = false;
  try {
    process.kill(pid, 'SIGTERM');
    stopped = true;
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ESRCH') {
      stopped = false;
    } else {
      throw err;
    }
  } finally {
    removeRunningPrototypeByPid(pid);
  }

  return stopped;
}

export function launchPrototypeServer(options: LaunchOptions): RunningPrototype {
  const { projectName, projectPath, port, env } = options;

  const child = spawn('npm', ['run', 'dev', '--', '-p', String(port)], {
    cwd: projectPath,
    env: { ...process.env, ...env },
    detached: true,
    stdio: 'ignore',
  });

  if (!child.pid) {
    throw new Error('Unable to start dev server');
  }

  const startedAt = new Date().toISOString();
  const running: RunningPrototype = {
    id: `${projectName}-${child.pid}-${startedAt}`,
    name: projectName,
    path: projectPath,
    port,
    pid: child.pid,
    startedAt,
  };

  const current = getRunningPrototypes();
  writeState([...current, running]);

  child.on('exit', () => {
    removeRunningPrototypeByPid(child.pid ?? -1);
  });

  child.on('error', () => {
    removeRunningPrototypeByPid(child.pid ?? -1);
  });

  child.unref();

  return running;
}

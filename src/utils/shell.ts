import { execa, ExecaError } from 'execa';
import { homedir } from 'os';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';
import net from 'net';

// Global verbose flag
let verboseMode = false;

export function setVerbose(verbose: boolean) {
  verboseMode = verbose;
}

export function isVerbose(): boolean {
  return verboseMode;
}

export interface CommandResult {
  success: boolean;
  stdout: string;
  stderr: string;
  error?: string;
}

export async function runCommand(
  command: string,
  args: string[] = [],
  options: { cwd?: string; env?: Record<string, string>; verbose?: boolean } = {}
): Promise<CommandResult> {
  const shouldLog = options.verbose ?? verboseMode;

  if (shouldLog) {
    // Use stderr for debug output so it doesn't conflict with Ink's stdout rendering
    console.error(`\n[DEBUG] Running: ${command} ${args.join(' ')}`);
    if (options.cwd) console.error(`[DEBUG] CWD: ${options.cwd}`);
  }

  try {
    const subprocess = execa(command, args, {
      cwd: options.cwd,
      env: { ...process.env, ...options.env },
      // Don't use shell mode - it can cause issues with argument parsing
      shell: false,
      // Stream output in verbose mode
      stdout: shouldLog ? 'inherit' : 'pipe',
      stderr: shouldLog ? 'inherit' : 'pipe',
    });

    const result = await subprocess;

    if (shouldLog) {
      console.error(`[DEBUG] Command succeeded`);
    }

    return {
      success: true,
      stdout: String(result.stdout || ''),
      stderr: String(result.stderr || ''),
    };
  } catch (err) {
    const error = err as ExecaError;

    if (shouldLog) {
      console.error(`[DEBUG] Command failed: ${error.message}`);
      if (error.stdout) console.error(`[DEBUG] stdout: ${error.stdout}`);
      if (error.stderr) console.error(`[DEBUG] stderr: ${error.stderr}`);
    }

    return {
      success: false,
      stdout: String(error.stdout || ''),
      stderr: String(error.stderr || ''),
      error: error.message,
    };
  }
}

export async function commandExists(command: string): Promise<boolean> {
  try {
    await execa('which', [command]);
    return true;
  } catch {
    return false;
  }
}

export function getHomeDir(): string {
  return homedir();
}

export function getDeveloperDir(): string {
  return join(homedir(), 'Developer');
}

export function getCalbotDir(): string {
  return join(homedir(), 'Developer', 'calbot-projects');
}

export function getProjects(): Array<{ name: string; path: string; createdAt: Date }> {
  const calbotDir = getCalbotDir();
  if (!existsSync(calbotDir)) {
    return [];
  }

  const entries = readdirSync(calbotDir, { withFileTypes: true });

  return entries
    .filter((entry: any) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry: any) => {
      const projectPath = join(calbotDir, entry.name);
      const stats = statSync(projectPath);
      return {
        name: entry.name,
        path: projectPath,
        createdAt: stats.birthtime,
      };
    })
    .sort((a: any, b: any) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function developerDirExists(): boolean {
  return existsSync(getDeveloperDir());
}

export async function checkPrerequisites(): Promise<{
  homebrew: boolean;
  node: boolean;
  npm: boolean;
  vscode: boolean;
  claudeCode: boolean;
  git: boolean;
}> {
  const [homebrew, node, npm, vscode, claudeCode, git] = await Promise.all([
    commandExists('brew'),
    commandExists('node'),
    commandExists('npm'),
    commandExists('code'),
    commandExists('claude'),
    commandExists('git'),
  ]);

  return { homebrew, node, npm, vscode, claudeCode, git };
}

export async function getNodeVersion(): Promise<string | null> {
  const result = await runCommand('node', ['--version']);
  return result.success ? result.stdout.trim() : null;
}

export async function getNpmVersion(): Promise<string | null> {
  const result = await runCommand('npm', ['--version']);
  return result.success ? result.stdout.trim() : null;
}

export async function findAvailablePort(startPort: number = 3000): Promise<number> {
  // First check using lsof (more reliable for detecting processes)
  const isPortInUseByLsof = async (port: number): Promise<boolean> => {
    const result = await runCommand('lsof', ['-i', `:${port}`, '-t'], { verbose: false });
    return result.success && result.stdout.trim().length > 0;
  };

  // Backup check using net module
  const isPortAvailableByNet = (port: number): Promise<boolean> => {
    return new Promise((resolve) => {
      const server = net.createServer();

      const cleanup = () => {
        server.removeAllListeners();
      };

      server.once('error', (err: NodeJS.ErrnoException) => {
        cleanup();
        resolve(false);
      });

      server.once('listening', () => {
        server.close(() => {
          cleanup();
          resolve(true);
        });
      });

      server.listen(port, '127.0.0.1');
    });
  };

  let port = startPort;
  while (port < startPort + 100) {
    // Check with lsof first (catches processes listening on the port)
    const inUse = await isPortInUseByLsof(port);
    if (!inUse) {
      // Double-check with net module
      const available = await isPortAvailableByNet(port);
      if (available) {
        return port;
      }
    }
    port++;
  }

  // Fallback to a random high port
  return 3000 + Math.floor(Math.random() * 1000);
}

export async function killProcessOnPort(port: number): Promise<boolean> {
  const result = await runCommand('lsof', ['-ti', `:${port}`]);
  if (result.success && result.stdout.trim()) {
    const pids = result.stdout.trim().split('\n');
    for (const pid of pids) {
      await runCommand('kill', ['-9', pid]);
    }
    return true;
  }
  return false;
}

import { getProjects, getCalbotDir, findAvailablePort } from '../utils/shell.js';
import { getRunningPrototypes } from '../utils/running.js';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import net from 'net';

const TEAL   = '\x1b[38;2;84;187;183m';
const ORANGE = '\x1b[38;2;241;152;0m';
const GREEN  = '\x1b[0;32m';
const DIM    = '\x1b[2m';
const BOLD   = '\x1b[1m';
const NC     = '\x1b[0m';

function cal(msg: string) {
  console.log(`${TEAL}(•${ORANGE}ᴗ${TEAL}•) cal>${NC} ${msg}`);
}

function isPortInUse(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const s = net.createServer();
    s.once('error', () => resolve(true));
    s.once('listening', () => { s.close(); resolve(false); });
    s.listen(port, '127.0.0.1');
  });
}

function getVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8'));
    return pkg.version ?? '?';
  } catch { return '?'; }
}

export async function statusCommand(): Promise<void> {
  console.log();
  cal('checking the nest...');
  console.log();

  // calbot version + node
  console.log(`  ${BOLD}calbot${NC}      v${getVersion()}`);
  console.log(`  ${BOLD}node${NC}        ${process.version}`);
  console.log();

  // Dashboard
  const dashPort = 4321;
  const dashRunning = await isPortInUse(dashPort);
  if (dashRunning) {
    console.log(`  ${GREEN}●${NC} dashboard   ${GREEN}running${NC} at http://localhost:${dashPort}`);
  } else {
    console.log(`  ${DIM}○ dashboard   not running  (start with: calbot dashboard)${NC}`);
  }
  console.log();

  // Prototypes
  const projects = getProjects();
  const running = getRunningPrototypes();

  if (projects.length === 0) {
    console.log(`  ${DIM}no prototypes yet${NC}`);
  } else {
    const runningCount = running.length;
    console.log(`  ${BOLD}prototypes${NC}  ${projects.length} total, ${runningCount} running`);
    console.log();

    for (const p of projects) {
      const r = running.find(x => x.name === p.name);
      if (r) {
        console.log(`  ${GREEN}●${NC} ${TEAL}${p.name}${NC}  ${DIM}:${r.port}${NC}`);
      } else {
        console.log(`  ${DIM}○ ${p.name}${NC}`);
      }
    }
  }

  console.log();
  console.log(`  ${DIM}📁 ${getCalbotDir()}${NC}`);
  console.log();
}

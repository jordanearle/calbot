import { existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { runCommand } from '../utils/shell.js';

const CAL_TEAL = '\x1b[38;2;84;187;183m';
const CAL_ORANGE = '\x1b[38;2;241;152;0m';
const GREEN = '\x1b[0;32m';
const RED = '\x1b[0;31m';
const DIM = '\x1b[2m';
const NC = '\x1b[0m';

function say(msg: string) {
  console.log(`${CAL_TEAL}(•${CAL_ORANGE}ᴗ${CAL_TEAL}•) cal>${NC} ${msg}`);
}
function ok(msg: string) {
  console.log(`  ${GREEN}✓${NC} ${msg}`);
}
function fail(msg: string) {
  console.log(`  ${RED}✗${NC} ${msg}`);
}
function info(msg: string) {
  console.log(`  ${DIM}→ ${msg}${NC}`);
}

export async function updateCommand(): Promise<void> {
  const calbotDir = join(homedir(), '.calbot-cli');

  if (!existsSync(calbotDir)) {
    console.log();
    say('Hmm, I can\'t find the calbot install directory.');
    info(`Expected: ${calbotDir}`);
    info('If you installed manually, run: git pull && npm install && npm run build && npm link');
    console.log();
    process.exit(1);
  }

  console.log();
  say('Checking for updates...');
  console.log();

  // Fetch latest from remote
  const fetch = await runCommand('git', ['fetch', '--quiet'], { cwd: calbotDir });
  if (!fetch.success) {
    fail('Could not reach GitHub. Check your internet connection.');
    console.log();
    process.exit(1);
  }

  // Check if we're behind
  const status = await runCommand('git', ['rev-list', 'HEAD..origin/main', '--count'], { cwd: calbotDir });
  const behind = parseInt(status.stdout.trim(), 10);

  if (behind === 0) {
    ok('Already up to date!');
    console.log();
    say('Nothing to do. *chirp*');
    console.log();
    return;
  }

  info(`${behind} new commit${behind === 1 ? '' : 's'} available — pulling...`);

  const pull = await runCommand('git', ['pull', '--quiet'], { cwd: calbotDir });
  if (!pull.success) {
    fail('git pull failed.');
    info(pull.error ?? pull.stderr);
    console.log();
    process.exit(1);
  }
  ok('Pulled latest code');

  const install = await runCommand('npm', ['install', '--quiet'], { cwd: calbotDir });
  if (!install.success) {
    fail('npm install failed.');
    console.log();
    process.exit(1);
  }
  ok('Dependencies updated');

  const build = await runCommand('npm', ['run', 'build'], { cwd: calbotDir });
  if (!build.success) {
    fail('Build failed.');
    info(build.stderr);
    console.log();
    process.exit(1);
  }
  ok('Built successfully');

  const link = await runCommand('npm', ['link'], { cwd: calbotDir });
  if (!link.success) {
    fail('npm link failed — you may need to run it manually with sudo.');
    console.log();
    process.exit(1);
  }
  ok('Linked to PATH');

  console.log();
  say('All done! calbot is up to date. *chirp chirp*');
  console.log();
}

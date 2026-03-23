import { startDashboardServer } from '../dashboard/server.js';
import { runCommand } from '../utils/shell.js';

export async function dashboardCommand(port: number = 4321): Promise<void> {
  try {
    await startDashboardServer(port);
  } catch (err: any) {
    if (err.code === 'EADDRINUSE') {
      console.log('\n  (•ᴗ•) Dashboard is already running at http://localhost:' + port);
      console.log('  Opening it for you...\n');
      await runCommand('open', ['http://localhost:' + port]);
      return;
    }
    throw err;
  }

  await runCommand('open', ['http://localhost:' + port]);
  // Keep the process alive
  await new Promise(() => {});
}

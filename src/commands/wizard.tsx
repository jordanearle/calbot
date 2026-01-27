import React, { useState, useEffect } from 'react';
import { Text, Box, Newline, useApp } from 'ink';
import { Intro } from '../components/Intro.js';
import { Cal, CAL_TEAL, CAL_ORANGE, getRandomMessage } from '../components/Cal.js';
import { StepList, StepStatus } from '../components/Spinner.js';
import {
  checkPrerequisites,
  runCommand,
  getDeveloperDir,
  developerDirExists,
  commandExists,
} from '../utils/shell.js';
import { existsSync, mkdirSync, appendFileSync, readFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface WizardStep {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
}

interface WizardCommandProps {
  verbose?: boolean;
}

export const WizardCommand: React.FC<WizardCommandProps> = ({ verbose }) => {
  const { exit } = useApp();
  const [phase, setPhase] = useState<'intro' | 'checking' | 'running' | 'complete' | 'error'>('intro');
  const [steps, setSteps] = useState<WizardStep[]>([
    { id: 'developer', label: 'Create ~/Developer folder', status: 'pending' },
    { id: 'homebrew', label: 'Check Homebrew', status: 'pending' },
    { id: 'node', label: 'Check Node.js', status: 'pending' },
    { id: 'vscode', label: 'Check VS Code', status: 'pending' },
    { id: 'claude', label: 'Check Claude Code', status: 'pending' },
    { id: 'path', label: 'Configure shell PATH', status: 'pending' },
  ]);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const updateStep = (id: string, updates: Partial<WizardStep>) => {
    setSteps((prev) =>
      prev.map((step) => (step.id === id ? { ...step, ...updates } : step))
    );
  };

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('checking'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'checking') return;

    const runWizard = async () => {
      setPhase('running');

      try {
        // Step 1: Create ~/Developer folder
        updateStep('developer', { status: 'running' });
        const devDir = getDeveloperDir();
        if (developerDirExists()) {
          updateStep('developer', { status: 'skipped', detail: 'Already exists' });
        } else {
          mkdirSync(devDir, { recursive: true });
          updateStep('developer', { status: 'success', detail: 'Created!' });
        }

        // Step 2: Check/Install Homebrew
        updateStep('homebrew', { status: 'running' });
        if (await commandExists('brew')) {
          updateStep('homebrew', { status: 'skipped', detail: 'Already installed' });
        } else {
          updateStep('homebrew', { status: 'running', detail: 'Installing...' });
          const brewResult = await runCommand(
            '/bin/bash',
            ['-c', '"$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"']
          );
          if (brewResult.success) {
            updateStep('homebrew', { status: 'success', detail: 'Installed!' });
          } else {
            updateStep('homebrew', { status: 'error', detail: 'Installation failed' });
            throw new Error('Homebrew installation failed');
          }
        }

        // Step 3: Check/Install Node.js
        updateStep('node', { status: 'running' });
        if (await commandExists('node')) {
          const nodeVersion = (await runCommand('node', ['--version'])).stdout.trim();
          updateStep('node', { status: 'skipped', detail: `${nodeVersion} installed` });
        } else {
          updateStep('node', { status: 'running', detail: 'Installing via Homebrew...' });
          const nodeResult = await runCommand('brew', ['install', 'node']);
          if (nodeResult.success) {
            updateStep('node', { status: 'success', detail: 'Installed!' });
          } else {
            updateStep('node', { status: 'error', detail: 'Installation failed' });
            throw new Error('Node.js installation failed');
          }
        }

        // Step 4: Check/Install VS Code
        updateStep('vscode', { status: 'running' });
        if (await commandExists('code')) {
          updateStep('vscode', { status: 'skipped', detail: 'Already installed' });
        } else {
          updateStep('vscode', { status: 'running', detail: 'Installing via Homebrew...' });
          const vscodeResult = await runCommand('brew', ['install', '--cask', 'visual-studio-code']);
          if (vscodeResult.success) {
            updateStep('vscode', { status: 'success', detail: 'Installed!' });
          } else {
            // Non-fatal, they might use another editor
            updateStep('vscode', { status: 'skipped', detail: 'Optional - you can install manually' });
          }
        }

        // Step 5: Check/Install Claude Code
        updateStep('claude', { status: 'running' });
        if (await commandExists('claude')) {
          updateStep('claude', { status: 'skipped', detail: 'Already installed' });
        } else {
          updateStep('claude', { status: 'running', detail: 'Installing via npm...' });
          const claudeResult = await runCommand('npm', ['install', '-g', '@anthropic-ai/claude-code']);
          if (claudeResult.success) {
            updateStep('claude', { status: 'success', detail: 'Installed!' });
          } else {
            updateStep('claude', { status: 'error', detail: 'Installation failed' });
            throw new Error('Claude Code installation failed');
          }
        }

        // Step 6: Configure PATH in .zshrc
        updateStep('path', { status: 'running' });
        const zshrcPath = join(homedir(), '.zshrc');
        const pathExport = '\n# Added by calbot\nexport PATH="$HOME/Developer/node_modules/.bin:$PATH"\n';

        let needsPathUpdate = true;
        if (existsSync(zshrcPath)) {
          const zshrcContent = readFileSync(zshrcPath, 'utf-8');
          if (zshrcContent.includes('Added by calbot')) {
            needsPathUpdate = false;
          }
        }

        if (needsPathUpdate) {
          appendFileSync(zshrcPath, pathExport);
          updateStep('path', { status: 'success', detail: 'Updated .zshrc' });
        } else {
          updateStep('path', { status: 'skipped', detail: 'Already configured' });
        }

        setPhase('complete');
      } catch (err) {
        setErrorMessage((err as Error).message);
        setPhase('error');
      }
    };

    runWizard();
  }, [phase]);

  useEffect(() => {
    if (phase === 'complete' || phase === 'error') {
      const timer = setTimeout(() => exit(), 3000);
      return () => clearTimeout(timer);
    }
  }, [phase, exit]);

  if (phase === 'intro') {
    return <Intro message="Let's get your dev environment set up!" />;
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Cal type={phase === 'error' ? 'error' : phase === 'complete' ? 'success' : 'thinking'}>
        {phase === 'running' && 'Setting up your development environment...'}
        {phase === 'complete' && getRandomMessage('success')}
        {phase === 'error' && `Oops! ${errorMessage}`}
      </Cal>
      <Newline />

      <StepList steps={steps} />

      {phase === 'complete' && (
        <>
          <Newline />
          <Box flexDirection="column" marginLeft={2}>
            <Text color="green" bold>All done!</Text>
            <Newline />
            <Cal>Your dev environment is ready! Here's what you can do next:</Cal>
            <Newline />
            <Box marginLeft={2} flexDirection="column">
              <Text>1. Open a new terminal (to load the updated PATH)</Text>
              <Text>2. Run <Text color={CAL_TEAL} bold>calbot new my-prototype</Text> to create your first prototype</Text>
              <Text>3. Have fun building! </Text>
            </Box>
          </Box>
        </>
      )}

      {phase === 'error' && (
        <>
          <Newline />
          <Cal type="error">
            Something went wrong. You might need to run some steps manually.
          </Cal>
          <Text dimColor>Error: {errorMessage}</Text>
        </>
      )}
    </Box>
  );
};

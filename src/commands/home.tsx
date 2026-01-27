import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Text, Box, Newline, useApp, useInput } from 'ink';
import SelectInput from 'ink-select-input';
import { Cal, CAL_TEAL, CAL_ORANGE } from '../components/Cal.js';
import { Intro } from '../components/Intro.js';
import { getProjects, getCalbotDir, runCommand, findAvailablePort } from '../utils/shell.js';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { randomBytes } from 'crypto';
import {
  getRunningPrototypes,
  launchPrototypeServer,
  RunningPrototype,
  stopRunningPrototype,
} from '../utils/running.js';

interface Project {
  name: string;
  path: string;
  createdAt: Date;
}

type DashboardEntry =
  | {
      kind: 'running';
      action: 'edit' | 'stop';
      project: RunningPrototype;
      index: number;
    }
  | {
      kind: 'project';
      project: Project;
      index: number;
    }
  | {
      kind: 'command';
      command: 'new' | 'exit';
      label: string;
      index: number;
    };

type DashboardEntryConfig =
  | {
      kind: 'running';
      action: 'edit' | 'stop';
      project: RunningPrototype;
    }
  | { kind: 'project'; project: Project }
  | { kind: 'command'; command: 'new' | 'exit'; label: string };

type Action = 'launch' | 'claude' | 'vscode' | 'back';

interface HomeProps {
  onCreateNew: () => void;
}

export const HomeCommand: React.FC<HomeProps> = ({ onCreateNew }) => {
  const { exit } = useApp();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [phase, setPhase] = useState<'loading' | 'list' | 'actions' | 'running'>('loading');
  const [actionMessage, setActionMessage] = useState<string>('');
  const [runningPrototypes, setRunningPrototypes] = useState<RunningPrototype[]>([]);
  const [cursorIndex, setCursorIndex] = useState<number>(0);

  const refreshRunningPrototypes = useCallback(() => {
    const running = getRunningPrototypes();
    setRunningPrototypes(running);
  }, []);

  const selectionEntries = useMemo<DashboardEntry[]>(() => {
    const entries: DashboardEntry[] = [];

    const pushEntry = (entry: DashboardEntryConfig) => {
      entries.push({ ...entry, index: entries.length } as DashboardEntry);
    };

    runningPrototypes.forEach((proj) => {
      pushEntry({ kind: 'running', action: 'edit', project: proj });
      pushEntry({ kind: 'running', action: 'stop', project: proj });
    });

    projects.forEach((project) => {
      pushEntry({ kind: 'project', project });
    });

    pushEntry({ kind: 'command', command: 'new', label: '+ Create new prototype' });
    pushEntry({ kind: 'command', command: 'exit', label: '✕ Exit' });

    return entries;
  }, [projects, runningPrototypes]);


  useEffect(() => {
    const loadProjects = async () => {
      const projs = getProjects();
      setProjects(projs);
      refreshRunningPrototypes();
      setPhase('list');
    };
    loadProjects();
  }, [refreshRunningPrototypes]);

  useEffect(() => {
    if (cursorIndex >= selectionEntries.length) {
      setCursorIndex(Math.max(0, selectionEntries.length - 1));
    }
  }, [cursorIndex, selectionEntries.length]);

  const handleSelectAction = async (item: { label: string; value: Action }) => {
    if (!selectedProject) return;

    if (item.value === 'back') {
      setSelectedProject(null);
      setPhase('list');
      return;
    }

    setPhase('running');

    switch (item.value) {
      case 'launch':
        setActionMessage(`Finding available port...`);
        const port = await findAvailablePort(3000);
        setActionMessage(`Starting ${selectedProject.name} on port ${port}...`);
        const runnerEnv = buildRunnerEnv(selectedProject, port);
        launchPrototypeServer({
          projectName: selectedProject.name,
          projectPath: selectedProject.path,
          port,
          env: runnerEnv,
        });
        // Wait a moment then open browser
        await new Promise(r => setTimeout(r, 2500));
        await runCommand('open', [`http://localhost:${port}`]);
        setActionMessage(`${selectedProject.name} is running at http://localhost:${port}`);
        refreshRunningPrototypes();
        break;

      case 'claude':
        setActionMessage(`Opening Claude Code for ${selectedProject.name}...`);
        await openClaudeForPath(selectedProject.path, selectedProject.name);
        setActionMessage('Claude Code session opened in Terminal!');
        break;

      case 'vscode':
        setActionMessage(`Opening ${selectedProject.name} in VS Code...`);
        await runCommand('code', [selectedProject.path]);
        setActionMessage('VS Code opened!');
        break;
    }

    // Show message briefly then go back to list
    await new Promise(r => setTimeout(r, 2000));
    setSelectedProject(null);
    setPhase('list');
  };

  const handleRunningAction = async (entry: Extract<DashboardEntry, { kind: 'running' }>) => {
    const { action, project } = entry;

    setPhase('running');

    if (action === 'edit') {
      setActionMessage(`Opening Claude Code for ${project.name}...`);
      await openClaudeForPath(project.path, project.name);
      setActionMessage('Claude Code session opened in Terminal!');
    } else if (action === 'stop') {
      setActionMessage(`Stopping ${project.name}...`);
      const stopped = stopRunningPrototype(project.pid);
      setActionMessage(
        stopped
          ? `${project.name} dev server stopped.`
          : `${project.name} was already stopped.`
      );
    }

    refreshRunningPrototypes();
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setPhase('list');
  };

  // Handle escape key to go back
  useInput((input, key) => {
    if (key.escape && phase === 'actions') {
      setSelectedProject(null);
      setPhase('list');
      return;
    }

    if (phase !== 'list' || selectionEntries.length === 0) {
      return;
    }

    if (key.upArrow || key.leftArrow) {
      setCursorIndex((prev) => Math.max(0, prev - 1));
      return;
    }

    if (key.downArrow || key.rightArrow) {
      setCursorIndex((prev) => Math.min(selectionEntries.length - 1, prev + 1));
      return;
    }

    if (key.return) {
      const entry = selectionEntries[cursorIndex];
      if (!entry) return;

      if (entry.kind === 'running') {
        handleRunningAction(entry);
      } else if (entry.kind === 'project') {
        setSelectedProject(entry.project);
        setPhase('actions');
      } else if (entry.kind === 'command') {
        if (entry.command === 'new') {
          onCreateNew();
        } else {
          exit();
        }
      }
    }
  });

  if (phase === 'loading') {
    return (
      <Box padding={1}>
        <Cal type="thinking">Loading your prototypes...</Cal>
      </Box>
    );
  }

  if (phase === 'running') {
    return (
      <Box flexDirection="column" padding={1}>
        <Cal type="thinking">{actionMessage}</Cal>
      </Box>
    );
  }

  if (phase === 'actions' && selectedProject) {
    const actionItems = [
      { label: `Launch dev server`, value: 'launch' as Action },
      { label: `Open Claude Code`, value: 'claude' as Action },
      { label: `Open in VS Code`, value: 'vscode' as Action },
      { label: `← Back to list`, value: 'back' as Action },
    ];

    return (
      <Box flexDirection="column" padding={1}>
        <Cal>What would you like to do with <Text color={CAL_TEAL} bold>{selectedProject.name}</Text>?</Cal>
        <Newline />
        <Box marginLeft={2}>
          <SelectInput
            items={actionItems}
            onSelect={handleSelectAction}
            indicatorComponent={({ isSelected }) => (
              <Text color={isSelected ? CAL_TEAL : undefined}>{isSelected ? '❯ ' : '  '}</Text>
            )}
            itemComponent={({ isSelected, label }) => (
              <Text color={isSelected ? CAL_TEAL : undefined}>{label}</Text>
            )}
          />
        </Box>
        <Newline />
        <Text dimColor>Press ESC to go back</Text>
      </Box>
    );
  }

  const calbotDir = getCalbotDir();
  const hasProjects = projects.length > 0;
  const hasRunning = runningPrototypes.length > 0;
  const runningEntries = selectionEntries.filter(
    (entry): entry is Extract<DashboardEntry, { kind: 'running' }> => entry.kind === 'running'
  );
  const projectEntries = selectionEntries.filter(
    (entry): entry is Extract<DashboardEntry, { kind: 'project' }> => entry.kind === 'project'
  );
  const commandEntries = selectionEntries.filter(
    (entry): entry is Extract<DashboardEntry, { kind: 'command' }> => entry.kind === 'command'
  );
  const currentEntry = selectionEntries[cursorIndex];

  const isEntrySelected = (entry: DashboardEntry | undefined) =>
    Boolean(entry && currentEntry && entry.index === currentEntry.index);

  const renderCursor = (entry: DashboardEntry | undefined) =>
    isEntrySelected(entry) ? '❯' : ' ';

  const renderProjectLine = (entry: Extract<DashboardEntry, { kind: 'project' }>) => {
    const isSelected = currentEntry && entry.index === currentEntry.index;
    const timeAgo = getTimeAgo(entry.project.createdAt);
    return (
      <Box key={`project-${entry.project.name}`}>
        <Text color={isSelected ? CAL_TEAL : undefined}>
          {renderCursor(entry)} {entry.project.name}
        </Text>
        {timeAgo && <Text dimColor> ({timeAgo})</Text>}
      </Box>
    );
  };

  return (
    <Box flexDirection="column" padding={1}>
      {/* Header */}
      <Box flexDirection="column" marginBottom={1}>
        <Box>
          <Text color={CAL_ORANGE} bold>{'(•ᴗ•)'}</Text>
          <Text color={CAL_TEAL} bold> calbot</Text>
          <Text dimColor> — prototype control room</Text>
        </Box>
        <Box marginTop={1}>
          <Cal>{hasProjects ? "Welcome back! Choose what to open next:" : "No prototypes yet. Let's create one!"}</Cal>
        </Box>
      </Box>

      {/* Stats row */}
      <Box flexDirection="row" marginBottom={1}>
        <Box
          borderStyle="round"
          borderColor={CAL_TEAL}
          paddingX={2}
          paddingY={0}
          marginRight={2}
          flexDirection="column"
          alignItems="center"
          minWidth={18}
        >
          <Text color={CAL_TEAL} bold>{projects.length}</Text>
          <Text dimColor>prototypes</Text>
        </Box>
        <Box
          borderStyle="round"
          borderColor={hasRunning ? 'green' : 'gray'}
          paddingX={2}
          paddingY={0}
          flexDirection="column"
          alignItems="center"
          minWidth={18}
        >
          <Text color={hasRunning ? 'green' : 'gray'} bold>{runningPrototypes.length}</Text>
          <Text dimColor>running</Text>
        </Box>
      </Box>

      {/* Running prototypes section - only show if there are running ones */}
      {hasRunning && (
        <Box
          borderStyle="round"
          borderColor="green"
          paddingX={2}
          paddingY={1}
          marginBottom={1}
          flexDirection="column"
        >
          <Box marginBottom={1}>
            <Text color="green" bold>● </Text>
            <Text bold>Running prototypes</Text>
          </Box>
          {runningPrototypes.map((proj) => {
            const projectEntriesForRun = runningEntries.filter((entry) => entry.project.pid === proj.pid);
            const editEntry = projectEntriesForRun.find((entry) => entry.action === 'edit');
            const stopEntry = projectEntriesForRun.find((entry) => entry.action === 'stop');

            return (
              <Box key={`${proj.pid}-${proj.port}`} flexDirection="column" marginBottom={1}>
                <Box>
                  <Text color="green" bold>{proj.name}</Text>
                  <Text dimColor> → </Text>
                  <Text color="cyan">http://127.0.0.1:{proj.port}</Text>
                </Box>
                <Box marginLeft={2} flexDirection="row" gap={2}>
                  {editEntry && (
                    <Text color={isEntrySelected(editEntry) ? CAL_ORANGE : 'white'}>
                      {renderCursor(editEntry)} Edit with Claude
                    </Text>
                  )}
                  {stopEntry && (
                    <Text color={isEntrySelected(stopEntry) ? 'red' : 'gray'}>
                      {renderCursor(stopEntry)} Stop
                    </Text>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      )}

      {/* Prototype library */}
      <Box
        borderStyle="round"
        borderColor={CAL_TEAL}
        paddingX={2}
        paddingY={1}
        flexDirection="column"
      >
        <Box marginBottom={1}>
          <Text color={CAL_TEAL} bold>Prototype library</Text>
          {hasProjects && <Text dimColor>  ↑/↓ to navigate, Enter to select</Text>}
        </Box>

        {hasProjects ? (
          <Box flexDirection="column">
            {projectEntries.map((entry) => renderProjectLine(entry))}
          </Box>
        ) : (
          <Text dimColor>No prototypes yet. Create your first one below!</Text>
        )}

        {/* Commands section with separator */}
        <Box marginTop={1} paddingTop={1} borderStyle="single" borderTop borderBottom={false} borderLeft={false} borderRight={false} borderColor="gray" flexDirection="column">
          {commandEntries.map((entry) => {
            const isNew = entry.command === 'new';
            const isExit = entry.command === 'exit';
            const selected = isEntrySelected(entry);

            return (
              <Text
                key={`command-${entry.command}`}
                color={isExit ? (selected ? 'red' : 'gray') : (selected ? CAL_ORANGE : 'yellow')}
                bold={isNew && selected}
              >
                {renderCursor(entry)} {entry.label}
              </Text>
            );
          })}
        </Box>
      </Box>

      {/* Footer */}
      <Box marginTop={1}>
        <Text dimColor>📁 {calbotDir}</Text>
      </Box>
    </Box>
  );
};

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

interface StoredProjectState {
  projectId?: string;
  templateId?: string;
  createdAt?: string;
}

function loadStoredProjectState(projectPath: string): StoredProjectState | null {
  const statePath = join(projectPath, '.calbot', 'state.json');
  if (!existsSync(statePath)) {
    return null;
  }

  try {
    const contents = readFileSync(statePath, 'utf-8');
    return JSON.parse(contents) as StoredProjectState;
  } catch {
    return null;
  }
}

function buildRunnerEnv(project: Project, port: number): Record<string, string> {
  const stored = loadStoredProjectState(project.path);
  const token = randomBytes(32).toString('hex');
  const createdAt = stored?.createdAt ?? new Date().toISOString();

  return {
    CALBOT_LOCAL_RUNNER: '1',
    CALBOT_TOKEN: token,
    CALBOT_PROJECT_ROOT: project.path,
    CALBOT_PROJECT_ID: stored?.projectId ?? project.name,
    CALBOT_PROJECT_NAME: project.name,
    CALBOT_TEMPLATE_ID: stored?.templateId ?? 'birdie',
    CALBOT_DEV_SERVER_PORT: String(port),
    CALBOT_DEV_SERVER_URL: `http://127.0.0.1:${port}`,
    CALBOT_CREATED_AT: createdAt,
  };
}

async function openClaudeForPath(projectPath: string, _projectName: string) {
  await runCommand('open', ['-a', 'Terminal', projectPath]);
  await new Promise((resolve) => setTimeout(resolve, 500));
  const escapedPath = escapeForAppleScript(projectPath);
  await runCommand('osascript', [
    '-e', `tell application "Terminal" to do script "cd '${escapedPath}' && claude"`
  ]);
}

function escapeForAppleScript(path: string): string {
  return path.replace(/'/g, "'\\''");
}

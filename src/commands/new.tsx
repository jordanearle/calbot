import React, { useState, useEffect } from 'react';
import { Text, Box, Newline, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import { Intro } from '../components/Intro.js';
import { Cal, CalFace, CAL_TEAL, CAL_ORANGE, getRandomMessage } from '../components/Cal.js';
import { LoadingExperience, Celebration } from '../components/LoadingExperience.js';
import { runCommand, getCalbotDir, findAvailablePort } from '../utils/shell.js';
import { join } from 'path';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { randomBytes, randomUUID } from 'crypto';
import {
  getBirdieGlobalsCss,
  getBirdieTailwindConfig,
  getBirdieLayoutTsx,
  getBirdiePageTsx,
  getBirdieNavComponents,
  getComponentsJson,
  getLibUtils,
} from '../templates/birdie/index.js';
import packageJson from '../../package.json' with { type: 'json' };
import { launchPrototypeServer } from '../utils/running.js';

const TEMPLATE_ID = 'birdie';

/**
 * Converts a human-readable project name to a valid npm package name.
 * npm names must be lowercase and can only contain URL-friendly characters.
 */
function toNpmSafeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-_.]/g, '')   // Remove invalid characters
    .replace(/^[-_.]+/, '')         // Remove leading special chars
    .replace(/[-_.]+$/, '')         // Remove trailing special chars
    .replace(/-+/g, '-');           // Collapse multiple hyphens
}

const CONTEXT_MD = `# Prototype Context

## Product Area
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

const CLAUDE_MD = `# Calbot Prototype

This is a Next.js prototype managed by Calbot. The dev server is already running with hot reload.

## Important Guidelines

### Where to Make Changes

**DO edit:**
- \`src/app/page.tsx\` - The main page content
- \`src/app/*/page.tsx\` - Any route pages you create
- Files in \`src/components/\` (except \`src/components/layout/\` and \`src/components/ui/\`)

**DO NOT edit:**
- \`src/components/layout/TopNav.tsx\` - The top navigation bar
- \`src/components/layout/SideNav.tsx\` - The side navigation
- \`src/app/layout.tsx\` - The root layout structure
- \`src/components/ui/*\` - The shadcn/ui primitives

The navigation and layout are intentionally locked to maintain design consistency. Focus all changes on the content area inside the main section.

### Using Components

Always use shadcn/ui components from \`@/components/ui/\`. Common ones already installed:
- \`Button\` - \`import { Button } from "@/components/ui/button"\`
- \`Card\`, \`CardHeader\`, \`CardTitle\`, \`CardDescription\`, \`CardContent\` - \`import { ... } from "@/components/ui/card"\`
- \`Avatar\`, \`AvatarImage\`, \`AvatarFallback\` - \`import { ... } from "@/components/ui/avatar"\`

To add more shadcn/ui components, run: \`npx shadcn@latest add <component-name>\`

### Birdie Design System Colors

These colors are defined in \`src/app/globals.css\` using Tailwind v4's \`@theme\` directive. Use these Tailwind classes:

**Brand colors:**
| Class | Color | Hex |
|-------|-------|-----|
| \`bg-birdie-primary\` | Teal | #54BDB8 |
| \`text-birdie-primary\` | Teal | #54BDB8 |
| \`bg-birdie-primary-light\` | Light teal | #A6FAE8 |
| \`bg-birdie-nav\` | Navy | rgb(21, 41, 81) |

**Status colors (for badges, alerts, cards):**
| Status | Background | Text | Border |
|--------|------------|------|--------|
| Green | \`bg-green-bg\` #e6f7ef | \`text-green-text\` #072c1e | \`border-green-border\` #acdec8 |
| Blue | \`bg-blue-bg\` #ebf3ff | \`text-blue-text\` #0f2757 | \`border-blue-border\` #c1d6ff |
| Yellow | \`bg-yellow-bg\` #fff0d1 | \`text-yellow-text\` #3d1f00 | \`border-yellow-border\` #f0ce99 |
| Red | \`bg-red-bg\` #feecef | \`text-red-text\` #811316 | \`border-red-border\` #ffced6 |
| Purple | \`bg-purple-bg\` #f6ebfb | \`text-purple-text\` #390042 | \`border-purple-border\` #e3c5ed |
| Orange | \`bg-orange-bg\` #feede2 | \`text-orange-text\` #5d1d14 | \`border-orange-border\` #fdceaf |
| Cyan | \`bg-cyan-bg\` #def7f9 | \`text-cyan-text\` #0b323c | \`border-cyan-border\` #9ddde7 |

**Neutral colors:**
| Class | Use | Hex |
|-------|-----|-----|
| \`bg-background\` | Page background | #ffffff |
| \`bg-background-2\` | Secondary/card backgrounds | #f3f4f7 |
| \`bg-neutral-bg\` | Muted UI elements | #e3e7ed |
| \`text-neutral-text\` | Body text | #606876 |
| \`text-neutral-text-dark\` | Headings, emphasis | #151619 |
| \`border-neutral-border\` | Standard borders | #c5c9d3 |

**High contrast variants (for icons, links on colored backgrounds):**
- \`text-green-high-contrast\` #006643
- \`text-blue-high-contrast\` #1847a5
- \`text-red-high-contrast\` #c20a1d

### Best Practices

1. **Keep it simple** - This is a prototype, not production code. Favor clarity over abstraction.
2. **Use existing patterns** - Look at \`src/app/page.tsx\` for examples of how to structure content.
3. **Responsive by default** - Use Tailwind's responsive prefixes (\`sm:\`, \`md:\`, \`lg:\`) when needed.
4. **Don't start the dev server** - It's already running. Just edit files and changes appear automatically.

### Project Structure

\`\`\`
src/
├── app/
│   ├── layout.tsx      # DO NOT EDIT - Root layout
│   ├── page.tsx        # EDIT THIS - Main page
│   ├── globals.css     # Design tokens (reference only)
│   └── [routes]/       # Add new pages here
├── components/
│   ├── layout/         # DO NOT EDIT - Navigation components
│   └── ui/             # DO NOT EDIT - shadcn/ui primitives
└── lib/
    └── utils.ts        # Utility functions (cn helper)
\`\`\`
`;

interface CalbotState {
  projectId: string;
  projectName: string;
  templateId: string;
  createdAt: string;
  runtime: {
    devServerUrl: string;
    devServerPort: number;
    nodeVersion: string;
    packageManager: string;
  };
  ux: {
    lastViewedPath: string;
    lastActionAt: string;
    selection: string | null;
  };
  safety: {
    runnerPid: number;
    runnerVersion: string;
  };
  claude: {
    preferredOpenMode: 'claude_cli';
  };
}

function buildInitialCalbotState(params: {
  projectId: string;
  projectName: string;
  templateId: string;
  createdAt: string;
  port: number;
}): CalbotState {
  const { projectId, projectName, templateId, createdAt, port } = params;
  const devServerUrl = `http://127.0.0.1:${port}`;

  return {
    projectId,
    projectName,
    templateId,
    createdAt,
    runtime: {
      devServerUrl,
      devServerPort: port,
      nodeVersion: process.version,
      packageManager: 'npm',
    },
    ux: {
      lastViewedPath: '/',
      lastActionAt: createdAt,
      selection: null,
    },
    safety: {
      runnerPid: process.pid,
      runnerVersion: packageJson.version,
    },
    claude: {
      preferredOpenMode: 'claude_cli',
    },
  };
}

function writeJsonFile(filePath: string, data: unknown) {
  writeFileSync(filePath, JSON.stringify(data, null, 2));
}

interface NewCommandProps {
  projectName: string;
  verbose?: boolean;
}

type StepStatus = 'pending' | 'running' | 'success' | 'error';

interface Step {
  id: string;
  label: string;
  status: StepStatus;
  detail?: string;
}

export const NewCommand: React.FC<NewCommandProps> = ({ projectName, verbose }) => {
  const { exit } = useApp();
  const [phase, setPhase] = useState<'intro' | 'running' | 'complete' | 'error'>('intro');
  const [currentStep, setCurrentStep] = useState<string>('Preparing...');
  const [stepDetail, setStepDetail] = useState<string>('');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [projectPath, setProjectPath] = useState<string>('');
  const [finalPort, setFinalPort] = useState<number>(3000);
  const [editorChoice, setEditorChoice] = useState<'code' | 'cursor' | 'skip' | null>(null);
  const [editorStatus, setEditorStatus] = useState<'idle' | 'running' | 'success' | 'error'>('idle');
  const [editorError, setEditorError] = useState<string>('');
  const [editorPromptHidden, setEditorPromptHidden] = useState<boolean>(false);

  useEffect(() => {
    if (phase === 'intro') {
      const timer = setTimeout(() => setPhase('running'), 2000);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== 'running') return;

    const createProject = async () => {
      const calbotDir = getCalbotDir();
      const npmSafeName = toNpmSafeName(projectName);
      const projPath = join(calbotDir, npmSafeName);
      setProjectPath(projPath);
      const projectId = randomUUID();
      const createdAtIso = new Date().toISOString();
      const calbotToken = randomBytes(32).toString('hex');
      const templateId = TEMPLATE_ID;
      let calbotMetaDir = '';
      let calbotStatePath = '';
      let calbotLogPath = '';

      try {
        // Ensure calbot-projects directory exists
        if (!existsSync(calbotDir)) {
          mkdirSync(calbotDir, { recursive: true });
        }

        // Check if project already exists
        if (existsSync(projPath)) {
          throw new Error(`Project "${projectName}" already exists at ${projPath}!`);
        }

        // Step 1: Create Next.js app
        setCurrentStep('Creating Next.js app');
        setStepDetail('Setting up your project structure...');

        const createResult = await runCommand(
          'npx',
          [
            '--yes',
            'create-next-app@latest',
            npmSafeName,
            '--yes',
            '--typescript',
            '--tailwind',
            '--eslint',
            '--app',
            '--src-dir',
            '--import-alias', '@/*',
            '--use-npm',
            '--no-turbopack',
          ],
          { cwd: calbotDir }
        );

        if (!createResult.success) {
          throw new Error(`Failed to create Next.js app: ${createResult.error}`);
        }
        setCompletedSteps(prev => [...prev, 'Next.js app created']);

        calbotMetaDir = join(projPath, '.calbot');
        if (!existsSync(calbotMetaDir)) {
          mkdirSync(calbotMetaDir, { recursive: true });
        }

        calbotStatePath = join(calbotMetaDir, 'state.json');
        calbotLogPath = join(calbotMetaDir, 'log.txt');
        writeFileSync(join(projPath, 'CLAUDE.md'), CLAUDE_MD);
        writeFileSync(join(projPath, 'context.md'), CONTEXT_MD);
        const notesPath = join(calbotMetaDir, 'notes.md');
        if (!existsSync(notesPath)) {
          writeFileSync(notesPath, '');
        }

        // Step 2: Initialize shadcn
        setCurrentStep('Installing UI components');
        setStepDetail('Adding shadcn/ui magic...');

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
        setCompletedSteps(prev => [...prev, 'UI components installed']);

        // Step 3: Add Birdie design tokens
        setCurrentStep('Adding Birdie design system');
        setStepDetail('Applying colors, typography & tokens...');

        writeFileSync(join(projPath, 'src', 'app', 'globals.css'), getBirdieGlobalsCss());
        writeFileSync(join(projPath, 'tailwind.config.ts'), getBirdieTailwindConfig());
        setCompletedSteps(prev => [...prev, 'Design system configured']);

        // Step 4: Create Birdie layout
        setCurrentStep('Building the layout');
        setStepDetail('Crafting navigation & structure...');

        mkdirSync(join(projPath, 'src', 'components', 'layout'), { recursive: true });
        const navComponents = getBirdieNavComponents();
        writeFileSync(join(projPath, 'src', 'components', 'layout', 'TopNav.tsx'), navComponents.topNav);
        writeFileSync(join(projPath, 'src', 'components', 'layout', 'SideNav.tsx'), navComponents.sideNav);
        writeFileSync(join(projPath, 'src', 'app', 'layout.tsx'), getBirdieLayoutTsx());
        writeFileSync(join(projPath, 'src', 'app', 'page.tsx'), getBirdiePageTsx(projectName));
        setCompletedSteps(prev => [...prev, 'Layout created']);

        // Step 5: Final npm install
        setCurrentStep('Final touches');
        setStepDetail('Making sure everything is linked...');
        await runCommand('npm', ['install'], { cwd: projPath });
        setCompletedSteps(prev => [...prev, 'Dependencies linked']);

        // Step 6: Start dev server
        setCurrentStep('Launching your prototype');
        setStepDetail('Finding the perfect port...');

        const port = await findAvailablePort(3000);
        setFinalPort(port);
        setStepDetail(`Starting server on port ${port}...`);

        if (calbotStatePath) {
          const initialState = buildInitialCalbotState({
            projectId,
            projectName,
            templateId,
            createdAt: createdAtIso,
            port,
          });
          writeJsonFile(calbotStatePath, initialState);
        }

        if (calbotLogPath) {
          const logLine = `${new Date().toISOString()} | ${projectId} | init`;
          writeFileSync(calbotLogPath, `${logLine}\n`);
        }

        const runnerEnv = {
          CALBOT_LOCAL_RUNNER: '1',
          CALBOT_TOKEN: calbotToken,
          CALBOT_PROJECT_ROOT: projPath,
          CALBOT_PROJECT_ID: projectId,
          CALBOT_PROJECT_NAME: projectName,
          CALBOT_TEMPLATE_ID: templateId,
          CALBOT_DEV_SERVER_PORT: String(port),
          CALBOT_DEV_SERVER_URL: `http://127.0.0.1:${port}`,
          CALBOT_CREATED_AT: createdAtIso,
        } satisfies Record<string, string>;

        launchPrototypeServer({
          projectName,
          projectPath: projPath,
          port,
          env: runnerEnv,
        });
        await new Promise((resolve) => setTimeout(resolve, 3000));

        await runCommand('open', [`http://localhost:${port}`]);

        setPhase('complete');
      } catch (err) {
        setErrorMessage((err as Error).message);
        setPhase('error');
      }
    };

    createProject();
  }, [phase, projectName]);

  const handleEditorSelect = (item: { label: string; value: 'code' | 'cursor' | 'skip' }) => {
    if (!projectPath || editorStatus === 'running') {
      return;
    }

    setEditorChoice(item.value);
    setEditorError('');

    if (item.value === 'skip') {
      setEditorStatus('success');
      setEditorPromptHidden(true);
      return;
    }

    setEditorStatus('running');
    const command = item.value === 'code' ? 'code' : 'cursor';

    (async () => {
      const result = await runCommand(command, [projectPath]);
      if (result.success) {
        setEditorStatus('success');
        setEditorPromptHidden(true);
      } else {
        setEditorStatus('error');
        setEditorError(result.error || result.stderr || 'Unable to open editor');
      }
    })();
  };

  if (phase === 'intro') {
    return (
      <Box flexDirection="column" padding={1}>
        <Intro message={`Let's build "${projectName}"!`} showFull={true} />
      </Box>
    );
  }

  if (phase === 'running') {
    // Verbose mode: simple static output (no animations that conflict with debug logs)
    if (verbose) {
      return (
        <Box flexDirection="column" padding={1}>
          <Text color={CAL_TEAL} bold>Building: {projectName}</Text>
          <Newline />
          {completedSteps.map((step, i) => (
            <Text key={i} color="green">✓ {step}</Text>
          ))}
          <Text color={CAL_ORANGE}>➤ {currentStep}...</Text>
          {stepDetail && <Text dimColor>  {stepDetail}</Text>}
        </Box>
      );
    }

    // Normal mode: fancy animated UI
    return (
      <Box flexDirection="column" padding={1}>
        {/* Header */}
        <Box marginBottom={1} borderStyle="double" borderColor={CAL_TEAL} paddingX={2} paddingY={1}>
          <Text color={CAL_TEAL} bold>
            ✨ Building: {projectName}
          </Text>
        </Box>

        {/* Completed steps */}
        {completedSteps.length > 0 && (
          <Box flexDirection="column" marginBottom={1} marginLeft={1}>
            {completedSteps.map((step, i) => (
              <Box key={i}>
                <Text color="green">✓ </Text>
                <Text dimColor>{step}</Text>
              </Box>
            ))}
          </Box>
        )}

        {/* Current loading experience */}
        <LoadingExperience
          currentStep={currentStep}
          stepDetail={stepDetail}
          showTips={true}
        />
      </Box>
    );
  }

  if (phase === 'complete') {
    return (
      <Box flexDirection="column" padding={1}>
        {/* Success header */}
        <Box marginBottom={1}>
          <Celebration message={`${projectName} is ready!`} />
        </Box>

        <Newline />

        {/* All steps completed */}
        <Box flexDirection="column" marginLeft={1} marginBottom={1}>
          {completedSteps.map((step, i) => (
            <Box key={i}>
              <Text color="green">✓ </Text>
              <Text>{step}</Text>
            </Box>
          ))}
          <Box>
            <Text color="green">✓ </Text>
            <Text>Dev server running</Text>
          </Box>
        </Box>

        {/* Info box */}
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor={CAL_TEAL}
          paddingX={2}
          paddingY={1}
          marginTop={1}
        >
          <Box marginBottom={1}>
            <CalFace color={CAL_TEAL} />
            <Text color={CAL_TEAL}> cal{'>'} </Text>
            <Text>Your prototype is live!</Text>
          </Box>

          <Box flexDirection="column" marginLeft={2}>
            <Box>
              <Text dimColor>📁 Project: </Text>
              <Text color={CAL_TEAL}>{projectPath}</Text>
            </Box>
            <Box>
              <Text dimColor>🌐 URL:     </Text>
              <Text color={CAL_ORANGE}>http://localhost:{finalPort}</Text>
            </Box>
            <Box>
              <Text dimColor>📝 Editor:  </Text>
              <Text>
                {editorStatus === 'running' && editorChoice
                  ? `Opening ${editorChoice === 'code' ? 'VS Code' : 'Cursor'}...`
                  : editorChoice === 'code' && editorStatus === 'success'
                    ? 'VS Code (opened)'
                    : editorChoice === 'cursor' && editorStatus === 'success'
                      ? 'Cursor (opened)'
                      : editorChoice === 'skip' && editorStatus === 'success'
                        ? 'Skipped (not opened)'
                        : 'Choose below'}
              </Text>
            </Box>
          </Box>
        </Box>

        {!editorPromptHidden && (
          <Box flexDirection="column" marginTop={2} marginLeft={1}>
            <Text bold>Open an editor?</Text>
            <Text dimColor>Select an option below:</Text>
            <Box marginTop={1} marginLeft={1}>
              <SelectInput
                items={[
                  { label: 'Open in VS Code', value: 'code' as const },
                  { label: 'Open in Cursor', value: 'cursor' as const },
                  { label: 'Skip for now', value: 'skip' as const },
                ]}
                onSelect={handleEditorSelect}
                indicatorComponent={({ isSelected }) => (
                  <Text color={isSelected ? CAL_TEAL : undefined}>{isSelected ? '❯ ' : '  '}</Text>
                )}
                itemComponent={({ isSelected, label }) => (
                  <Text color={isSelected ? CAL_TEAL : undefined}>{label}</Text>
                )}
              />
            </Box>
          </Box>
        )}

        {editorStatus === 'error' && (
          <Box marginTop={1} marginLeft={2}>
            <Text color="red">Failed to open {editorChoice === 'cursor' ? 'Cursor' : 'VS Code'}: {editorError}</Text>
          </Box>
        )}

        {editorChoice === 'skip' && editorStatus === 'success' && (
          <Box marginTop={1} marginLeft={2}>
            <Text dimColor>Skipped opening an editor. You can open VS Code or Cursor manually later.</Text>
          </Box>
        )}

        {/* Next steps */}
        <Box flexDirection="column" marginTop={2} marginLeft={1}>
          <Text bold>What's next?</Text>
          <Newline />
          <Box flexDirection="column" marginLeft={2}>
            <Text>• Open the project in your editor of choice - changes auto-refresh!</Text>
            <Text>• Run <Text color={CAL_ORANGE}>claude</Text> in the project to get AI help</Text>
            <Text>• Run <Text color={CAL_TEAL}>calbot</Text> to manage all your prototypes</Text>
          </Box>
        </Box>

        <Newline />
        <Text dimColor>Press Ctrl+C to exit (server keeps running)</Text>
      </Box>
    );
  }

  // Error state
  return (
    <Box flexDirection="column" padding={1}>
      <Box marginBottom={1}>
        <CalFace beak="︵" color="red" />
        <Text color="red"> cal{'>'} </Text>
        <Text color="red">Oops! Something went wrong</Text>
      </Box>

      <Box
        flexDirection="column"
        borderStyle="round"
        borderColor="red"
        paddingX={2}
        paddingY={1}
      >
        <Text>{errorMessage}</Text>
      </Box>

      <Newline />
      <Text dimColor>Try running the command again with -v for more details:</Text>
      <Text dimColor>  calbot new {projectName} -v</Text>
    </Box>
  );
};

#!/usr/bin/env node
import { Command } from 'commander';
import { render, Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import React, { useState } from 'react';
import { WizardCommand } from './commands/wizard.js';
import { NewCommand } from './commands/new.js';
import { HomeCommand } from './commands/home.js';
import { Intro } from './components/Intro.js';
import { setVerbose } from './utils/shell.js';
import { Cal, CalFace, CAL_ORANGE, CAL_TEAL } from './components/Cal.js';

type AppPhase = 'home' | 'name-prompt' | 'creating';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>('home');
  const [projectName, setProjectName] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleCreateNew = () => {
    setPhase('name-prompt');
  };

  const handleNameSubmit = (name: string) => {
    const trimmed = name.trim();
    if (trimmed) {
      setProjectName(trimmed);
      setPhase('creating');
    }
  };

  if (phase === 'home') {
    return <HomeCommand onCreateNew={handleCreateNew} />;
  }

  if (phase === 'name-prompt') {
    return (
      <Box flexDirection="column" padding={1}>
        {/* Header */}
        <Box marginBottom={1}>
          <Box><CalFace color={CAL_ORANGE} /></Box>
          <Text color={CAL_TEAL} bold> calbot</Text>
          <Text dimColor> — new prototype</Text>
        </Box>

        <Box
          borderStyle="round"
          borderColor={CAL_ORANGE}
          paddingX={2}
          paddingY={1}
          flexDirection="column"
        >
          <Box marginBottom={1}>
            <Text color={CAL_ORANGE} bold>+ </Text>
            <Text bold>Create new prototype</Text>
          </Box>

          <Cal>What should we call it?</Cal>

          <Box marginTop={1}>
            <Text color={CAL_ORANGE} bold>{'>'} </Text>
            <TextInput
              value={inputValue}
              onChange={setInputValue}
              onSubmit={handleNameSubmit}
              placeholder="my-awesome-app"
            />
          </Box>

          <Box marginTop={1}>
            <Text dimColor>Enter a name using lowercase letters and dashes (e.g. expense-tracker)</Text>
          </Box>
        </Box>

        <Box marginTop={1}>
          <Text dimColor>Press </Text>
          <Text color={CAL_TEAL}>Enter</Text>
          <Text dimColor> to continue or </Text>
          <Text color="gray">Ctrl+C</Text>
          <Text dimColor> to cancel</Text>
        </Box>
      </Box>
    );
  }

  if (phase === 'creating') {
    return <NewCommand projectName={projectName} />;
  }

  return null;
};

const program = new Command();

program
  .name('calbot')
  .description("(•ᴗ•) Cal's friendly prototyping assistant for Birdie")
  .version('1.0.0')
  .action(async () => {
    // Default action - show home screen with project list
    const instance = render(<App />);
    await instance.waitUntilExit();
  });

program
  .command('wizard')
  .description('Set up your development environment')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (options: { verbose?: boolean }) => {
    if (options.verbose) setVerbose(true);
    const { waitUntilExit } = render(<WizardCommand verbose={options.verbose} />);
    await waitUntilExit();
  });

program
  .command('new <name>')
  .description('Create a new Birdie prototype')
  .option('-v, --verbose', 'Show detailed output')
  .action(async (name: string, options: { verbose?: boolean }) => {
    if (options.verbose) setVerbose(true);
    const { waitUntilExit } = render(<NewCommand projectName={name} verbose={options.verbose} />);
    await waitUntilExit();
  });

program
  .command('hello')
  .description('Say hello to Cal!')
  .action(async () => {
    const { waitUntilExit } = render(<Intro message="Ready to build something amazing?" />);
    await waitUntilExit();
  });

program.parse();

import React from 'react';
import { Text, Box } from 'ink';
import InkSpinner from 'ink-spinner';
import { CAL_TEAL, CAL_ORANGE, getRandomMessage } from './Cal.js';

interface SpinnerProps {
  message?: string;
  showCalMessage?: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  message = 'Loading...',
  showCalMessage = true
}) => {
  return (
    <Box flexDirection="column" gap={1}>
      <Box>
        <Text color={CAL_TEAL}>
          <InkSpinner type="dots" />
        </Text>
        <Text> {message}</Text>
      </Box>
      {showCalMessage && (
        <Text color={CAL_ORANGE} dimColor>
          {"  "}(•.•) cal{'>'} {getRandomMessage('loading')}
        </Text>
      )}
    </Box>
  );
};

// Step status indicator
export type StepStatus = 'pending' | 'running' | 'success' | 'error' | 'skipped';

interface StepProps {
  status: StepStatus;
  label: string;
  detail?: string;
}

export const Step: React.FC<StepProps> = ({ status, label, detail }) => {
  const getIcon = () => {
    switch (status) {
      case 'pending': return '○';
      case 'running': return '◐';
      case 'success': return '✓';
      case 'error': return '✗';
      case 'skipped': return '⊘';
    }
  };

  const getColor = () => {
    switch (status) {
      case 'pending': return 'gray';
      case 'running': return CAL_TEAL;
      case 'success': return 'green';
      case 'error': return 'red';
      case 'skipped': return 'yellow';
    }
  };

  return (
    <Box>
      <Text color={getColor()}>
        {status === 'running' ? <InkSpinner type="dots" /> : getIcon()}
      </Text>
      <Text color={status === 'pending' ? 'gray' : undefined}> {label}</Text>
      {detail && <Text dimColor> - {detail}</Text>}
    </Box>
  );
};

interface StepListProps {
  steps: Array<{ id: string; label: string; status: StepStatus; detail?: string }>;
}

export const StepList: React.FC<StepListProps> = ({ steps }) => {
  return (
    <Box flexDirection="column" marginLeft={2}>
      {steps.map((step) => (
        <Step key={step.id} status={step.status} label={step.label} detail={step.detail} />
      ))}
    </Box>
  );
};

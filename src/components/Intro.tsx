import React, { useState, useEffect } from 'react';
import { Text, Box, Newline } from 'ink';
import { CAL_TEAL, CAL_ORANGE, Cal, getRandomMessage } from './Cal.js';

const BIRD_ASCII = `      _...._
    /       \\
   /  o _ o
   (    \\/  )
  )          (
(    -  -  -  )
(             )
 (            )
  [          ]
---/l\\    /l\\--------
  ----------------
     (  )
    ( __ _)`;

const CALBOT_ASCII = `▗▄▄▖ ▗▄▖ ▗▖   ▗▄▄▖  ▗▄▖▗▄▄▄▖
▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌ █
▐▌   ▐▛▀▜▌▐▌   ▐▛▀▚▖▐▌ ▐▌ █
▝▚▄▄▖▐▌ ▐▌▐▙▄▄▖▐▙▄▞▘▝▚▄▞▘ █`;

interface IntroProps {
  message?: string;
  showFull?: boolean;
  onComplete?: () => void;
}

export const Intro: React.FC<IntroProps> = ({
  message = "Ready to build something amazing?",
  showFull = true,
  onComplete
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(true);
      if (onComplete) {
        setTimeout(onComplete, 500);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <Box flexDirection="column" padding={1}>
      {showFull && (
        <>
          <Box flexDirection="row" gap={4}>
            <Text color={CAL_TEAL}>{BIRD_ASCII}</Text>
            <Box flexDirection="column" justifyContent="center">
              <Text color={CAL_ORANGE} bold>{CALBOT_ASCII}</Text>
              <Newline />
              <Text color={CAL_TEAL} dimColor>Birdie's friendly prototyping assistant</Text>
            </Box>
          </Box>
          <Newline />
        </>
      )}
      <Cal>{message}</Cal>
    </Box>
  );
};

export const SmallIntro: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <Box flexDirection="column" paddingY={1}>
      <Cal>{message || getRandomMessage('greetings')}</Cal>
    </Box>
  );
};

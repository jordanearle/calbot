import React from 'react';
import { Text, Box } from 'ink';

// Cal's brand colors
export const CAL_TEAL = '#54BBB7';
export const CAL_ORANGE = '#F19800';

interface CalProps {
  children: React.ReactNode;
  type?: 'normal' | 'success' | 'warning' | 'error' | 'thinking';
}

export const Cal: React.FC<CalProps> = ({ children, type = 'normal' }) => {
  const getEmoji = () => {
    switch (type) {
      case 'success': return '(•ᴗ•)';
      case 'warning': return '(•_•)';
      case 'error': return '(•︵•)';
      case 'thinking': return '(•.•)';
      default: return '(•ᴗ•)';
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success': return 'green';
      case 'warning': return CAL_ORANGE;
      case 'error': return 'red';
      default: return CAL_TEAL;
    }
  };

  return (
    <Box>
      <Text color={getColor()}>{getEmoji()} cal{'>'} </Text>
      <Text>{children}</Text>
    </Box>
  );
};

// Fun Cal messages for different situations
export const calMessages = {
  greetings: [
    "Hey there, friend!",
    "Oh hello! Ready to build something cool?",
    "Chirp chirp! Let's make something awesome!",
    "*happy bird noises*",
  ],
  loading: [
    "Flapping my wings...",
    "Gathering twigs for your nest...",
    "Doing some bird calculations...",
    "Fetching the good stuff...",
    "Almost there, just preening my feathers...",
  ],
  success: [
    "Nailed it!",
    "We did it! *happy dance*",
    "Success! Time for a victory chirp!",
    "Boom! That's what I'm talking about!",
  ],
  waiting: [
    "Patience, young padawan...",
    "Good things come to those who wait...",
    "Building your nest, one twig at a time...",
  ],
  errors: [
    "Uh oh, that didn't go as planned...",
    "Hmm, we hit a snag...",
    "Oops! Let me look into that...",
  ],
};

export const getRandomMessage = (category: keyof typeof calMessages): string => {
  const messages = calMessages[category];
  return messages[Math.floor(Math.random() * messages.length)];
};

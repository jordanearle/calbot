import React, { useState, useEffect } from 'react';
import { Text, Box, Newline } from 'ink';
import { CAL_TEAL, CAL_ORANGE } from './Cal.js';

// Render a face string with orange beak (middle character)
const AnimatedFace: React.FC<{ face: string; color: string }> = ({ face, color }) => {
  // Face format: (XYZ) where X=left eye, Y=beak, Z=right eye
  // Extract parts: ( + leftEye + beak + rightEye + )
  const left = face.slice(0, 2);   // "(" + left eye
  const beak = face.slice(2, -2);  // middle character(s)
  const right = face.slice(-2);    // right eye + ")"

  return (
    <>
      <Text color={color}>{left}</Text>
      <Text color={CAL_ORANGE}>{beak}</Text>
      <Text color={color}>{right}</Text>
    </>
  );
};

// Animated Cal faces
const calFrames = [
  '(•ᴗ•)',
  '(•ᴗ•)',
  '(•‿•)',
  '(•‿•)',
  '(◠‿◠)',
  '(◠‿◠)',
  '(•‿•)',
  '(•‿•)',
];

const calThinkingFrames = [
  '(•.•)',
  '(•.•)',
  '(•..)',
  '(..•)',
  '(•.•)',
  '(>.>)',
  '(<.<)',
  '(•.•)',
];

// Fun loading messages
const loadingMessages = [
  "Gathering the finest pixels...",
  "Teaching components to dance...",
  "Brewing some fresh TypeScript...",
  "Convincing npm to cooperate...",
  "Polishing the buttons extra shiny...",
  "Aligning all the divs (it's harder than it looks)...",
  "Adding a sprinkle of Birdie magic...",
  "Warming up the dev server...",
  "Folding the CSS just right...",
  "Summoning the React spirits...",
  "Untangling the node_modules...",
  "Giving the components a pep talk...",
  "Making sure the colors are colorful...",
  "Double-checking the semicolons...",
  "Inflating the padding...",
  "Rounding the corners perfectly...",
];

// Tips to show while waiting
const tips = [
  { title: "Pro Tip", text: "Ask Claude to 'add a data table with sorting' for instant functionality!" },
  { title: "Did you know?", text: "You can run 'npx shadcn add [component]' to add more UI components" },
  { title: "Pro Tip", text: "Use Cmd+K in VS Code to quickly navigate files" },
  { title: "Fun fact", text: "Cal's favorite color is #54BBB7 (that's teal!)" },
  { title: "Pro Tip", text: "Ask Claude to 'make it responsive' and watch the magic happen" },
  { title: "Did you know?", text: "Tailwind classes like 'hover:bg-blue-500' add instant interactivity" },
  { title: "Pro Tip", text: "Stuck? Ask Claude 'what should I build next?'" },
  { title: "Fun fact", text: "Cal has consumed mass amounts of React documentation so you don't have to" },
  { title: "Pro Tip", text: "Try 'calbot' to see all your prototypes in one place!" },
  { title: "Did you know?", text: "The Birdie design system has 10 color palettes built in" },
];

// Bird animation frames for extra flair
const birdFrames = [
  `   ___
  (o o)
 (  V  )
/--m-m--\\`,
  `   ___
  (o o)
 (  V  )
\\--m-m--/`,
  `   ___
  (o o)
  ( V )
 /--m-m--\\`,
  `   ___
  (o o)
  ( V )
 \\--m-m--/`,
];

const miniCalFrames = [
  `  ▄▄
 (•ᴗ•)
  /|\\
  / \\  `,
  `  ▄▄
 (•ᴗ•)
 \\|/
  / \\  `,
  `  ▄▄
 (•‿•)
  /|\\
  / \\  `,
  `  ▄▄
 (•‿•)
 \\|/
  / \\  `,
];

interface LoadingExperienceProps {
  currentStep: string;
  stepDetail?: string;
  showTips?: boolean;
}

export const LoadingExperience: React.FC<LoadingExperienceProps> = ({
  currentStep,
  stepDetail,
  showTips = true,
}) => {
  const [frame, setFrame] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);
  const [dots, setDots] = useState('');

  // Animate frame
  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % calThinkingFrames.length);
    }, 200);
    return () => clearInterval(timer);
  }, []);

  // Rotate loading messages
  useEffect(() => {
    const timer = setInterval(() => {
      setMessageIndex(i => (i + 1) % loadingMessages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Rotate tips
  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex(i => (i + 1) % tips.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Animated dots
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(d => d.length >= 3 ? '' : d + '.');
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const currentTip = tips[tipIndex];
  const progressBar = createProgressBar(frame);

  return (
    <Box flexDirection="column" paddingX={2}>
      {/* Main loading indicator */}
      <Box marginBottom={1}>
        <AnimatedFace face={calThinkingFrames[frame]} color={CAL_TEAL} />
        <Text color={CAL_TEAL}> cal{'>'} </Text>
        <Text>{currentStep}</Text>
        <Text dimColor>{dots}</Text>
      </Box>

      {/* Step detail */}
      {stepDetail && (
        <Box marginLeft={7} marginBottom={1}>
          <Text dimColor>↳ {stepDetail}</Text>
        </Box>
      )}

      {/* Animated progress bar */}
      <Box marginBottom={1}>
        <Text>{progressBar}</Text>
      </Box>

      {/* Fun loading message */}
      <Box marginBottom={1}>
        <Text color={CAL_ORANGE} dimColor>
          ✨ {loadingMessages[messageIndex]}
        </Text>
      </Box>

      {/* Tip box */}
      {showTips && (
        <Box
          flexDirection="column"
          borderStyle="round"
          borderColor="gray"
          paddingX={2}
          paddingY={1}
          marginTop={1}
        >
          <Text color={CAL_TEAL} bold>{currentTip.title}</Text>
          <Text>{currentTip.text}</Text>
        </Box>
      )}
    </Box>
  );
};

function createProgressBar(frame: number): string {
  const width = 30;
  const position = frame % (width * 2);
  const actualPos = position < width ? position : (width * 2) - position;

  let bar = '│';
  for (let i = 0; i < width; i++) {
    if (i === actualPos) {
      bar += '█';
    } else if (Math.abs(i - actualPos) === 1) {
      bar += '▓';
    } else if (Math.abs(i - actualPos) === 2) {
      bar += '▒';
    } else {
      bar += '░';
    }
  }
  bar += '│';
  return bar;
}

// A simpler inline spinner for step lists
export const InlineSpinner: React.FC = () => {
  const [frame, setFrame] = useState(0);
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % frames.length);
    }, 80);
    return () => clearInterval(timer);
  }, []);

  return <Text color={CAL_TEAL}>{frames[frame]}</Text>;
};

// Celebration animation for when things complete
export const Celebration: React.FC<{ message: string }> = ({ message }) => {
  const [frame, setFrame] = useState(0);
  const confetti = ['🎉', '✨', '🎊', '⭐', '💫', '🌟'];

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(f => (f + 1) % confetti.length);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box>
      <Text>{confetti[frame]} </Text>
      <Text color="green" bold>{message}</Text>
      <Text> {confetti[(frame + 3) % confetti.length]}</Text>
    </Box>
  );
};

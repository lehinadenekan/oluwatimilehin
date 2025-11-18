'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CallBackProps, Step } from 'react-joyride';

// Dynamically import Joyride with SSR disabled to prevent hydration errors
const Joyride = dynamic(() => import('react-joyride'), { ssr: false });

// Full walkthrough steps
export const walkthroughSteps: Step[] = [
  {
    target: '[data-testid="game-board"]',
    title: 'Game Board',
    content: 'This is where your word guesses appear. Each row represents one guess attempt. Green means correct position, purple means right letter but wrong position!',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-testid="keyboard-container"]',
    title: 'Yorùbá Keyboard',
    content: 'Use this keyboard to type authentic Yorùbá words. Notice the special characters like ẹ, ọ, ṣ, and tonal marks like à, é!',
    placement: 'top',
    disableBeacon: true,
  },
  {
    target: '[data-tour="new-game"]',
    title: 'New Game',
    content: 'Click here anytime to restart with a fresh word. Perfect for practice or when you want to try a different difficulty!',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="statistics"]',
    title: 'Statistics',
    content: 'Track your progress here! See your win rate, current streak, guess distribution, and detailed game history.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="settings"]',
    title: 'Settings',
    content: 'Customise your experience! Change word length (2-7 letters), toggle helpful hints like tonal accents, and adjust difficulty.',
    placement: 'bottom',
    disableBeacon: true,
  },
  {
    target: '[data-tour="help"]',
    title: 'Help & Hints',
    content: 'Get hints about the current word, learn game rules, see the word\'s meaning, and restart this walkthrough anytime!',
    placement: 'bottom',
    disableBeacon: true,
  },
];

interface GameWalkthroughProps {
  run: boolean;
  stepIndex?: number;
  steps?: Step[];
  callback: (data: CallBackProps) => void;
}

// Minimal, working styles
const joyrideStyles = {
  options: {
    primaryColor: '#7c3aed',
    zIndex: 10000,
    arrowColor: '#7c3aed',
    backgroundColor: '#1f2937',
    textColor: '#ffffff',
    overlayColor: 'rgba(0, 0, 0, 0.6)',
    spotlightPadding: 8,
    padding: 16,
    borderRadius: 8,
    maxWidth: '90vw',
    minWidth: '250px',
  },
  tooltipTitle: {
    color: '#7c3aed',
    fontWeight: 700,
    fontSize: 18,
  },
  tooltipContent: {
    fontSize: 14,
    lineHeight: 1.4,
  },
  buttonNext: {
    backgroundColor: '#7c3aed',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 600,
    minHeight: 40,
    minWidth: 60,
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    cursor: 'pointer',
  },
  buttonBack: {
    color: '#7c3aed',
    fontSize: 14,
    minHeight: 40,
    minWidth: 60,
    padding: '8px 16px',
    borderRadius: 6,
    border: '2px solid #7c3aed',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  buttonSkip: {
    color: '#6b7280',
    fontSize: 14,
    minHeight: 40,
    minWidth: 60,
    padding: '8px 16px',
    borderRadius: 6,
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  spotlight: {
    backgroundColor: 'transparent',
    borderRadius: 6,
  },
};

const GameWalkthroughComponent: React.FC<GameWalkthroughProps> = ({ 
  run, 
  stepIndex, 
  steps = walkthroughSteps,
  callback,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <Joyride
      steps={steps}
      run={run}
      {...(stepIndex !== undefined && { stepIndex })}
      continuous={true}
      showProgress={true}
      showSkipButton={true}
      styles={joyrideStyles}
      locale={{
        back: 'Back',
        close: 'Close',
        last: 'Finish',
        next: 'Next',
        skip: 'Skip All',
      }}
      callback={callback}
      floaterProps={{
        hideArrow: false,
        placement: 'bottom',
        offset: 10,
      }}
      spotlightClicks={true}
      disableScrolling={false}
      scrollToFirstStep={true}
      scrollOffset={50}
      disableOverlayClose={true}
    />
  );
};

export default GameWalkthroughComponent;


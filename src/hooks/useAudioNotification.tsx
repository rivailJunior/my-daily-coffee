"use client";

import { useEffect, useRef } from "react";

// Component that creates audio notifications for brewing steps
export const useAudioNotification = () => {
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize AudioContext on component mount
    if (typeof window !== "undefined" && !audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Clean up on unmount
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Play pour notification sound
  const playPourSound = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Configure sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 1);
    
    // Play sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 1);
  };

  // Play step completion notification
  const playStepCompleteSound = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    // Configure sound
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(523.25, context.currentTime); // C5 note
    oscillator.frequency.setValueAtTime(659.25, context.currentTime + 0.2); // E5 note
    oscillator.frequency.setValueAtTime(783.99, context.currentTime + 0.4); // G5 note
    gainNode.gain.setValueAtTime(0, context.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + 0.1);
    gainNode.gain.linearRampToValueAtTime(0, context.currentTime + 0.6);
    
    // Play sound
    oscillator.start(context.currentTime);
    oscillator.stop(context.currentTime + 0.6);
  };

  // Play brewing complete notification
  const playBrewingCompleteSound = () => {
    if (!audioContextRef.current) return;
    
    const context = audioContextRef.current;
    
    // Play a sequence of notes
    const playNote = (frequency: number, startTime: number, duration: number) => {
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + startTime);
      
      gainNode.gain.setValueAtTime(0, context.currentTime + startTime);
      gainNode.gain.linearRampToValueAtTime(0.5, context.currentTime + startTime + 0.1);
      gainNode.gain.linearRampToValueAtTime(0, context.currentTime + startTime + duration);
      
      oscillator.start(context.currentTime + startTime);
      oscillator.stop(context.currentTime + startTime + duration);
    };
    
    // Play a simple melody
    playNote(523.25, 0, 0.3);    // C5
    playNote(659.25, 0.3, 0.3);  // E5
    playNote(783.99, 0.6, 0.3);  // G5
    playNote(1046.50, 0.9, 0.6); // C6 (longer)
  };

  return {
    playPourSound,
    playStepCompleteSound,
    playBrewingCompleteSound
  };
};

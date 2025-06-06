import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Countdown = ({ seconds }: { seconds: number }) => {
  return (
    <div className='absolute inset-0 flex items-center justify-center'>
      <AnimatePresence>
        <motion.h1
          key={seconds}
          exit={{ y: -5, opacity: 0, position: 'absolute' }}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: 2 }}
          //   transition={{
          //     ease: 'easeOut',
          //     duration: 1,
          //   }}
          className='text-4xl sm:text-5xl md:text-6xl font-bold font-mono text-center'
        >
          {seconds}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};

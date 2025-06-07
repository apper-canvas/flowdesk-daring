import React from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/atoms/Button';

const MotionButton = ({ children, className, onClick, type = 'button', disabled, ...motionProps }) => {
  return (
    <motion.div {...motionProps} className="inline-block"> {/* motion.div wrapper to apply animation to a functional Button component */}
      <Button
        className={className}
        onClick={onClick}
        type={type}
        disabled={disabled}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default MotionButton;
import React from 'react';
import { motion } from 'framer-motion';
import Input from '@/components/atoms/Input';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import ApperIcon from '@/components/ApperIcon'; // ApperIcon is in existing components folder

const FormField = ({ value, onChange, placeholder, type = 'text', required, as: Component = Input, children, ...props }) => {
  const isSelect = Component === Select;
  const isTextarea = Component === Textarea;

  return (
    <div className="relative">
      <Component
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required={required}
        className={`w-full px-4 py-3 border border-surface-300 dark:border-surface-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-surface-700 text-surface-900 dark:text-white placeholder:text-surface-400 transition-all ${isSelect ? 'appearance-none' : ''} ${isTextarea ? 'resize-none' : ''}`}
        {...props} // Pass through any other props like 'rows' for textarea or 'min/step' for number input
      >
        {children}
      </Component>
      {isSelect && (
        <ApperIcon name="ChevronDown" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400 pointer-events-none" />
      )}
      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-primary"
        initial={{ width: 0 }}
        animate={{ width: value ? '100%' : 0 }}
        transition={{ duration: 0.3 }}
      />
    </div>
  );
};

export default FormField;
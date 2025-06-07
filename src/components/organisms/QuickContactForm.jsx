import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import MotionButton from '@/components/molecules/MotionButton';
import Spinner from '@/components/atoms/Spinner';

const QuickContactForm = ({ onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error('Name and email are required');
      return;
    }
    onSubmit(formData);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <FormField
        type="text"
        placeholder="Contact Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        required
      />

      <FormField
        type="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        required
      />

      <FormField
        type="text"
        placeholder="Company (Optional)"
        value={formData.company}
        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
      />

      <div className="flex space-x-3 pt-2">
        <MotionButton
          type="submit"
          disabled={submitting}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          {submitting ? (
            <>
              <Spinner />
              <span>Adding...</span>
            </>
          ) : (
            <>
              <ApperIcon name="UserPlus" className="w-4 h-4" />
              <span>Add Contact</span>
            </>
          )}
        </MotionButton>
        <MotionButton
          type="button"
          onClick={onCancel}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
        >
          Cancel
        </MotionButton>
      </div>
    </motion.form>
  );
};

export default QuickContactForm;
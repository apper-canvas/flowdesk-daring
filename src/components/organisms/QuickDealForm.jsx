import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import MotionButton from '@/components/molecules/MotionButton';
import Select from '@/components/atoms/Select';
import Spinner from '@/components/atoms/Spinner';

const QuickDealForm = ({ contacts, onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    contactId: '',
    value: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.contactId) {
      toast.error('Deal title and contact are required');
      return;
    }
    onSubmit({
      ...formData,
      value: parseFloat(formData.value) || 0
    });
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
        placeholder="Deal Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        required
      />

      <FormField
        as={Select}
        value={formData.contactId}
        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
        required
      >
        <option value="">Select Contact</option>
        {contacts.map(contact => (
          <option key={contact.id} value={contact.id}>{contact.name}</option>
        ))}
      </FormField>

      <FormField
        type="number"
        placeholder="Deal Value ($)"
        value={formData.value}
        onChange={(e) => setFormData({ ...formData, value: e.target.value })}
        min="0"
        step="0.01"
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
              <span>Creating...</span>
            </>
          ) : (
            <>
              <ApperIcon name="TrendingUp" className="w-4 h-4" />
              <span>Create Deal</span>
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

export default QuickDealForm;
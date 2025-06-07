import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import MotionButton from '@/components/molecules/MotionButton';
import Textarea from '@/components/atoms/Textarea';
import Select from '@/components/atoms/Select';
import Spinner from '@/components/atoms/Spinner';

const QuickActivityForm = ({ contacts, onSubmit, onCancel, submitting }) => {
  const [formData, setFormData] = useState({
    type: 'Call',
    description: '',
    contactId: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.description.trim()) {
      toast.error('Activity description is required');
      return;
    }
    onSubmit({
      ...formData,
      contactId: formData.contactId || null
    });
  };

  const activityTypes = ['Call', 'Email', 'Meeting', 'Note', 'Task'];

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div className="grid grid-cols-5 gap-2">
        {activityTypes.map(type => (
          <MotionButton
            key={type}
            type="button"
            onClick={() => setFormData({ ...formData, type })}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`py-2 px-3 rounded-lg text-xs font-medium transition-colors ${
              formData.type === type
                ? 'bg-primary text-white'
                : 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
            }`}
          >
            {type}
          </MotionButton>
        ))}
      </div>

      <FormField
        as={Textarea}
        placeholder="What did you do?"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        rows="3"
        required
      />

      <FormField
        as={Select}
        value={formData.contactId}
        onChange={(e) => setFormData({ ...formData, contactId: e.target.value })}
      >
        <option value="">Select Contact (Optional)</option>
        {contacts.map(contact => (
          <option key={contact.id} value={contact.id}>{contact.name}</option>
        ))}
      </FormField>

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
              <span>Logging...</span>
            </>
          ) : (
            <>
              <ApperIcon name="Calendar" className="w-4 h-4" />
              <span>Log Activity</span>
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

export default QuickActivityForm;
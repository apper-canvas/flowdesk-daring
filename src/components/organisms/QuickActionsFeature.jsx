import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import QuickActionCard from '@/components/molecules/QuickActionCard';
import QuickContactForm from '@/components/organisms/QuickContactForm';
import QuickDealForm from '@/components/organisms/QuickDealForm';
import QuickActivityForm from '@/components/organisms/QuickActivityForm';
import { contactService, dealService, activityService } from '@/services';

const QuickActionsFeature = () => {
  const [activeForm, setActiveForm] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState({
    contact: false,
    deal: false,
    activity: false
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [contactsData, dealsData] = await Promise.all([
          contactService.getAll(),
          dealService.getAll()
        ]);
        setContacts(contactsData);
        setDeals(dealsData);
      } catch (error) {
        console.error('Failed to load data for quick forms:', error);
      }
    };
    loadData();
  }, []);

  const handleQuickContact = async (formData) => {
    setSubmitting(true);
    try {
      await contactService.create(formData);
      toast.success('Contact added successfully!');
      setActiveForm(null);
      // Reload contacts for deal/activity forms
      const updatedContacts = await contactService.getAll();
      setContacts(updatedContacts);
    } catch (error) {
      toast.error('Failed to add contact');
    } finally {
      setSubmitting(false);
    }
  };

const handleQuickDeal = async (formData) => {
    setSubmitting(true);
    try {
      // Ensure contactId is properly converted to integer for database
      const dealData = { 
        ...formData, 
        stage: 'Lead', 
        status: 'Open', 
        probability: 25,
        contactId: formData.contactId ? parseInt(formData.contactId) : null
      };
      await dealService.create(dealData);
      toast.success('Deal created successfully!');
      setActiveForm(null);
      // Reload deals for activity forms
      const updatedDeals = await dealService.getAll();
      setDeals(updatedDeals);
    } catch (error) {
      toast.error('Failed to create deal');
    } finally {
      setSubmitting(false);
    }
  };

const handleQuickActivity = async (formData) => {
    setSubmitting(true);
    try {
      // Ensure contactId and dealId are properly converted to integers for database
      const activityData = {
        ...formData,
        timestamp: new Date(),
        completed: false,
        contactId: formData.contactId ? parseInt(formData.contactId) : null,
        dealId: formData.dealId ? parseInt(formData.dealId) : null
      };
      await activityService.create(activityData);
      toast.success('Activity logged successfully!');
      setActiveForm(null);
    } catch (error) {
      toast.error('Failed to log activity');
    } finally {
      setSubmitting(false);
    }
  };

  const handleActionClick = (action) => {
    setLoading({ ...loading, [action]: true });
    setTimeout(() => {
      setLoading({ ...loading, [action]: false });
      setActiveForm(action);
    }, 800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-card border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="p-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary-dark rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-surface-900 dark:text-white">Quick Actions</h3>
        </div>
        <p className="text-surface-500">Fast-track your CRM workflow with instant actions</p>
      </div>

      <div className="p-6">
        <AnimatePresence mode="wait">
          {!activeForm ? (
            <motion.div
              key="actions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <QuickActionCard
                title="Add Contact"
                description="Quickly add a new contact to your CRM"
                icon="UserPlus"
                color="bg-blue-500"
                onClick={() => handleActionClick('contact')}
                loading={loading.contact}
              />
              <QuickActionCard
                title="Create Deal"
                description="Start tracking a new sales opportunity"
                icon="TrendingUp"
                color="bg-green-500"
                onClick={() => handleActionClick('deal')}
                loading={loading.deal}
              />
              <QuickActionCard
                title="Log Activity"
                description="Record your latest customer interaction"
                icon="Calendar"
                color="bg-purple-500"
                onClick={() => handleActionClick('activity')}
                loading={loading.activity}
              />
            </motion.div>
          ) : (
            <motion.div key="form" className="max-w-md mx-auto">
              {activeForm === 'contact' && (
                <QuickContactForm
                  onSubmit={handleQuickContact}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
              {activeForm === 'deal' && (
                <QuickDealForm
                  contacts={contacts}
                  onSubmit={handleQuickDeal}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
              {activeForm === 'activity' && (
                <QuickActivityForm
                  contacts={contacts}
                  deals={deals}
                  onSubmit={handleQuickActivity}
                  onCancel={() => setActiveForm(null)}
                  submitting={submitting}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default QuickActionsFeature;
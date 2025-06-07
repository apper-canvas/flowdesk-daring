import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const activityService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "type", "description", "contact_id", "deal_id", "timestamp", "completed", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.fetchRecords('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data?.map(activity => ({
        id: activity.Id,
        type: activity.type || 'Call',
        description: activity.description || '',
        contactId: activity.contact_id,
        dealId: activity.deal_id,
        timestamp: activity.timestamp || activity.CreatedOn,
        completed: activity.completed || false
      })) || []
    } catch (error) {
      console.error('Error fetching activities:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "type", "description", "contact_id", "deal_id", "timestamp", "completed", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.getRecordById('Activity1', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) return null
      
      const activity = response.data
      return {
        id: activity.Id,
        type: activity.type || 'Call',
        description: activity.description || '',
        contactId: activity.contact_id,
        dealId: activity.deal_id,
        timestamp: activity.timestamp || activity.CreatedOn,
        completed: activity.completed || false
      }
    } catch (error) {
      console.error(`Error fetching activity with ID ${id}:`, error)
      throw error
    }
  },

  async create(activityData) {
    try {
      const apperClient = getApperClient()
      
      // Only include updateable fields and format data properly
      const params = {
        records: [{
          Name: activityData.description || '',
          type: activityData.type || 'Call',
          description: activityData.description || '',
          contact_id: activityData.contactId || null,
          deal_id: activityData.dealId || null,
          timestamp: activityData.timestamp ? new Date(activityData.timestamp).toISOString() : new Date().toISOString(),
          completed: activityData.completed || false
        }]
      }
      
      const response = await apperClient.createRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} activities:`, failedRecords)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const activity = successfulRecords[0].data
          return {
            id: activity.Id,
            type: activity.type || 'Call',
            description: activity.description || '',
            contactId: activity.contact_id,
            dealId: activity.deal_id,
            timestamp: activity.timestamp || activity.CreatedOn,
            completed: activity.completed || false
          }
        }
      }
      
      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error creating activity:', error)
      throw error
    }
  },

  async update(id, updateData) {
    try {
      const apperClient = getApperClient()
      
      // Only include updateable fields and format data properly
      const params = {
        records: [{
          Id: id,
          Name: updateData.description || '',
          type: updateData.type || 'Call',
          description: updateData.description || '',
          contact_id: updateData.contactId || null,
          deal_id: updateData.dealId || null,
          timestamp: updateData.timestamp ? new Date(updateData.timestamp).toISOString() : null,
          completed: updateData.completed !== undefined ? updateData.completed : false
        }]
      }
      
      const response = await apperClient.updateRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} activities:`, failedUpdates)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const activity = successfulUpdates[0].data
          return {
            id: activity.Id,
            type: activity.type || 'Call',
            description: activity.description || '',
            contactId: activity.contact_id,
            dealId: activity.deal_id,
            timestamp: activity.timestamp || activity.CreatedOn,
            completed: activity.completed || false
          }
        }
      }
      
      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating activity:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('Activity1', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} activities:`, failedDeletions)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error('Error deleting activity:', error)
      throw error
    }
  }
}

export default activityService
import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const dealService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "title", "value", "stage", "probability", "expected_close_date", "status", "contact_id", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.fetchRecords('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data?.map(deal => ({
        id: deal.Id,
        title: deal.title || deal.Name || '',
        value: deal.value || 0,
        stage: deal.stage || 'Lead',
        probability: deal.probability || 0,
        expectedCloseDate: deal.expected_close_date,
        status: deal.status || 'Open',
        contactId: deal.contact_id,
        createdAt: deal.CreatedOn
      })) || []
    } catch (error) {
      console.error('Error fetching deals:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "title", "value", "stage", "probability", "expected_close_date", "status", "contact_id", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.getRecordById('deal', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) return null
      
      const deal = response.data
      return {
        id: deal.Id,
        title: deal.title || deal.Name || '',
        value: deal.value || 0,
        stage: deal.stage || 'Lead',
        probability: deal.probability || 0,
        expectedCloseDate: deal.expected_close_date,
        status: deal.status || 'Open',
        contactId: deal.contact_id,
        createdAt: deal.CreatedOn
      }
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error)
      throw error
    }
  },

  async create(dealData) {
    try {
      const apperClient = getApperClient()
      
      // Only include updateable fields and format data properly
      const params = {
        records: [{
          Name: dealData.title || '',
          title: dealData.title || '',
          value: dealData.value || 0,
          stage: dealData.stage || 'Lead',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expectedCloseDate ? new Date(dealData.expectedCloseDate).toISOString().split('T')[0] : null,
          status: dealData.status || 'Open',
          contact_id: dealData.contactId || null
        }]
      }
      
      const response = await apperClient.createRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} deals:`, failedRecords)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const deal = successfulRecords[0].data
          return {
            id: deal.Id,
            title: deal.title || deal.Name || '',
            value: deal.value || 0,
            stage: deal.stage || 'Lead',
            probability: deal.probability || 0,
            expectedCloseDate: deal.expected_close_date,
            status: deal.status || 'Open',
            contactId: deal.contact_id,
            createdAt: deal.CreatedOn
          }
        }
      }
      
      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error creating deal:', error)
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
          Name: updateData.title || '',
          title: updateData.title || '',
          value: updateData.value || 0,
          stage: updateData.stage || 'Lead',
          probability: updateData.probability || 0,
          expected_close_date: updateData.expectedCloseDate ? new Date(updateData.expectedCloseDate).toISOString().split('T')[0] : null,
          status: updateData.status || 'Open',
          contact_id: updateData.contactId || null
        }]
      }
      
      const response = await apperClient.updateRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} deals:`, failedUpdates)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const deal = successfulUpdates[0].data
          return {
            id: deal.Id,
            title: deal.title || deal.Name || '',
            value: deal.value || 0,
            stage: deal.stage || 'Lead',
            probability: deal.probability || 0,
            expectedCloseDate: deal.expected_close_date,
            status: deal.status || 'Open',
            contactId: deal.contact_id,
            createdAt: deal.CreatedOn
          }
        }
      }
      
      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating deal:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('deal', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} deals:`, failedDeletions)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error('Error deleting deal:', error)
      throw error
    }
  }
}

export default dealService
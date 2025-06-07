import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

// Helper function to validate and format deal data for database operations
const validateAndFormatDealData = (dealData) => {
  const formatted = {
    Name: dealData.title || '',
    title: dealData.title || '',
    value: typeof dealData.value === 'number' ? dealData.value : (parseFloat(dealData.value) || 0),
    stage: dealData.stage || 'Lead',
    probability: typeof dealData.probability === 'number' ? Math.round(dealData.probability) : (parseInt(dealData.probability) || 0),
    status: dealData.status || 'Open'
  }

  // Handle contact_id - must be integer for Lookup field
  if (dealData.contactId !== undefined && dealData.contactId !== null && dealData.contactId !== '') {
    const contactIdInt = parseInt(dealData.contactId)
    if (!isNaN(contactIdInt)) {
      formatted.contact_id = contactIdInt
    } else {
      formatted.contact_id = null
    }
  } else {
    formatted.contact_id = null
  }

  // Handle expected_close_date - must be proper date format
  if (dealData.expectedCloseDate) {
    try {
      formatted.expected_close_date = new Date(dealData.expectedCloseDate).toISOString().split('T')[0]
    } catch (error) {
      formatted.expected_close_date = null
    }
  } else {
    formatted.expected_close_date = null
  }

  return formatted
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
      
      // Only include updateable fields and format data properly with type validation
      const formattedData = validateAndFormatDealData(dealData)
      const params = {
        records: [formattedData]
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
      
      // Only include updateable fields and format data properly with type validation
      const formattedData = validateAndFormatDealData(updateData)
      formattedData.Id = id // Add the ID for update operation
      const params = {
        records: [formattedData]
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
      
      throw new Error('No successful updates')
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
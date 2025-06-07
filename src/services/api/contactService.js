import { toast } from 'react-toastify'

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  })
}

const contactService = {
  async getAll() {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "email", "phone", "company", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.fetchRecords('contact', params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      return response.data?.map(contact => ({
        id: contact.Id,
        name: contact.Name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      })) || []
    } catch (error) {
      console.error('Error fetching contacts:', error)
      throw error
    }
  },

  async getById(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        fields: ["Name", "email", "phone", "company", "Tags", "Owner", "CreatedOn", "CreatedBy", "ModifiedOn", "ModifiedBy"]
      }
      const response = await apperClient.getRecordById('contact', id, params)
      
      if (!response.success) {
        console.error(response.message)
        throw new Error(response.message)
      }
      
      if (!response.data) return null
      
      const contact = response.data
      return {
        id: contact.Id,
        name: contact.Name || '',
        email: contact.email || '',
        phone: contact.phone || '',
        company: contact.company || '',
        tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
        createdAt: contact.CreatedOn,
        updatedAt: contact.ModifiedOn
      }
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error)
      throw error
    }
  },

  async create(contactData) {
    try {
      const apperClient = getApperClient()
      
      // Only include updateable fields and format data properly
      const params = {
        records: [{
          Name: contactData.name || '',
          email: contactData.email || '',
          phone: contactData.phone || '',
          company: contactData.company || '',
          Tags: Array.isArray(contactData.tags) ? contactData.tags.join(',') : ''
        }]
      }
      
      const response = await apperClient.createRecord('contact', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success)
        const failedRecords = response.results.filter(result => !result.success)
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} contacts:`, failedRecords)
          failedRecords.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulRecords.length > 0) {
          const contact = successfulRecords[0].data
          return {
            id: contact.Id,
            name: contact.Name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            company: contact.company || '',
            tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            createdAt: contact.CreatedOn,
            updatedAt: contact.ModifiedOn
          }
        }
      }
      
      throw new Error('No successful records created')
    } catch (error) {
      console.error('Error creating contact:', error)
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
          Name: updateData.name || '',
          email: updateData.email || '',
          phone: updateData.phone || '',
          company: updateData.company || '',
          Tags: Array.isArray(updateData.tags) ? updateData.tags.join(',') : ''
        }]
      }
      
      const response = await apperClient.updateRecord('contact', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        throw new Error(response.message)
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success)
        const failedUpdates = response.results.filter(result => !result.success)
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} contacts:`, failedUpdates)
          failedUpdates.forEach(record => {
            record.errors?.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`)
            })
            if (record.message) toast.error(record.message)
          })
        }
        
        if (successfulUpdates.length > 0) {
          const contact = successfulUpdates[0].data
          return {
            id: contact.Id,
            name: contact.Name || '',
            email: contact.email || '',
            phone: contact.phone || '',
            company: contact.company || '',
            tags: contact.Tags ? contact.Tags.split(',').map(tag => tag.trim()).filter(Boolean) : [],
            createdAt: contact.CreatedOn,
            updatedAt: contact.ModifiedOn
          }
        }
      }
      
      throw new Error('No successful records updated')
    } catch (error) {
      console.error('Error updating contact:', error)
      throw error
    }
  },

  async delete(id) {
    try {
      const apperClient = getApperClient()
      const params = {
        RecordIds: [id]
      }
      
      const response = await apperClient.deleteRecord('contact', params)
      
      if (!response.success) {
        console.error(response.message)
        toast.error(response.message)
        return false
      }
      
      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success)
        const failedDeletions = response.results.filter(result => !result.success)
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} contacts:`, failedDeletions)
          failedDeletions.forEach(record => {
            if (record.message) toast.error(record.message)
          })
        }
        
        return successfulDeletions.length > 0
      }
      
      return false
    } catch (error) {
      console.error('Error deleting contact:', error)
      throw error
    }
  }
}

export default contactService
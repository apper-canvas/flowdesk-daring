import activitiesData from '../mockData/activities.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let activities = [...activitiesData]

const activityService = {
  async getAll() {
    await delay(280)
    return [...activities]
  },

  async getById(id) {
    await delay(200)
    const activity = activities.find(a => a.id === id)
    return activity ? { ...activity } : null
  },

  async create(activityData) {
    await delay(380)
    const newActivity = {
      id: Date.now().toString(),
      ...activityData,
      timestamp: activityData.timestamp || new Date().toISOString()
    }
    activities.unshift(newActivity)
    return { ...newActivity }
  },

  async update(id, updateData) {
    await delay(320)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    activities[index] = {
      ...activities[index],
      ...updateData
    }
    return { ...activities[index] }
  },

  async delete(id) {
    await delay(250)
    const index = activities.findIndex(a => a.id === id)
    if (index === -1) throw new Error('Activity not found')
    
    activities.splice(index, 1)
    return true
  }
}

export default activityService
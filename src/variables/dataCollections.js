import api from 'variables/data'

/**
 * Get all available devices for data collections
 * @function
 */
export const getAvailableDevices = async () => {
	let data = await api.get(`/senti/datacolletion/availabledevices`).then(rs => rs.data)
	return data
}
/**
 * Assign a Device to a collection
 * @function
 * @param obj - Contains:
 * id - Data Collection ID
 * deviceId - Device ID
 * start - Date
 */
export const assignDeviceToCollection = async (obj) => {
	let data = await api.post(`/senti/datacollection/assigndevice`, obj).then(rs => rs.data)
	return data
}
export const getCollection = async (id) => {
	let data = await api.get(`/senti/datacollection/${id}`).then(rs => rs.data)
	return data
}
export const getAllCollections = async () => {
	let data = await api.get(`/senti/datacollections`).then(rs => rs.data)
	return data
}
export const updateCollection = async (dc) => {
	let data = await api.put(`/senti/datacollection/${dc.id}`, dc).then(rs => rs.data)
	return data
}
export const createCollection = async (dc) => {
	let data = await api.post(`/senti/datacollection`, dc).then(rs => rs.data)
	return data
}
export const deleteCollection = async (id) => {
	let data = await api.delete(`/senti/datacollection/${id}`).then(rs => rs.data)
	return data
}
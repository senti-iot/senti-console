import { api } from 'variables/data'

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
/**
 * 
 * @param id 
 */
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
//#region get Data
/**
 * 
 * @param {int} id
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw 
 */
export const getDataDaily = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/daily/raw/${id}/${from}/${to}` : `/senti/sentiwi/daily/${id}/${from}/${to}` 
	let response = await api.get(URL)
	// console.log(response)
	return response.data ? response.data : response.status
}
/**
 * 
 * @param {int} id
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw 
 */
export const getDataHourly = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/hourly/raw/${id}/${from}/${to}` : `/senti/sentiwi/hourly/${id}/${from}/${to}`
	let response = await api.get(URL)
	// console.log(response)
	return response.data ? response.data : response.status
}

//#endregion
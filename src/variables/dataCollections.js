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
 * @param {Object} obj - Contains:
 * @param {int} obj.id - Data Collection ID
 * @param {int} obj.deviceId - Device ID
 * @param {Date} obj.start - Date
 */
export const assignDeviceToCollection = async (obj) => {
	let data = await api.post(`/senti/datacollection/assigndevice`, obj).then(rs => rs.data)
	return data
}
/**
 * @function
 * @param {Object} obj - Contains:
 * @param {int} obj.id - Data Collection ID
 * @param {int} obj.deviceId - Device ID
 * @param {Date} obj.end - Date
 */
export const unassignDeviceFromCollection = async (obj) => {
	let response = await api.post(`/senti/datacollection/unassigndevice`, obj)
	return response.data ? response.data : null
}
/**
 * @function
 * @param id - DataCollection ID
 */
export const getCollection = async (id) => {
	let data = await api.get(`/senti/datacollection/${id}`).then(rs => rs.data)
	return data
}
/**
 * Get All the Data Collections
 * @function
 */
export const getAllCollections = async () => {
	let data = await api.get(`/senti/datacollections`).then(rs => rs.data)
	return data
}
/**
 * Update Data Collection
 * @function
 * @param {Object} dc - Data Collection Object
 */
export const updateCollection = async (dc) => {
	let data = await api.put(`/senti/datacollection/${dc.id}`, dc).then(rs => rs.data)
	return data
}
/**
 * @function
 */
export const getEmptyCollection = async () => {
	let response = await api.get(`/senti/datacollection/empty`)
	return response.data
}
/** 
 * Create Collection
 * @function
 * @param {Object} dc - Data Collection Object based of `getEmptyCollection`
*/
export const createCollection = async (dc) => {
	let data = await api.post(`/senti/datacollection`, dc).then(rs => rs.data)
	return data
}
/**
 * Delete a Data Collection
 * @function
 * @param {int} id - Data collection Id to be deleted
 */
export const deleteCollection = async (id) => {
	let data = await api.delete(`/senti/datacollection/${id}`).then(rs => rs.data)
	return data
}
//#region get Data
/**
 * Get Daily Data
 * @function
 * @param {int} id - Data Collection ID
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw - Raw Data
 */
export const getDataDaily = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/daily/raw/${id}/${from}/${to}` : `/senti/sentiwi/daily/${id}/${from}/${to}` 
	let response = await api.get(URL)
	return response.ok ? response.data : null
}
/**
 * Get Hourly Data 
 * @function
 * @param {int} id - Data Collection ID
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw 
 */
export const getDataHourly = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/hourly/raw/${id}/${from}/${to}` : `/senti/sentiwi/hourly/${id}/${from}/${to}`
	let response = await api.get(URL)
	
	return response.data ? response.data : null
}
/**
 * Get Minutely Data 
 * @function
 * @param {int} id - Data Collection ID
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw 
 */
export const getDataMinutely = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/minutely/raw/${id}/${from}/${to}` : `/senti/sentiwi/minutely/${id}/${from}/${to}`
	let response = await api.get(URL)
	return response.data ? response.data : null
}
/**
 * Get Summary Data 
 * @function
 * @param {int} id - Data Collection ID
 * @param {Date} from - YYYY-MM-DDTHH:mm
 * @param {Date} to - YYYY-MM-DDTHH:mm
 * @param {bool} raw 
 */
export const getDataSummary = async (id, from, to, raw) => {
	let URL = raw ? `/senti/sentiwi/summary/raw/${id}/${from}/${to}` : `/senti/sentiwi/summary/${id}/${from}/${to}`
	let response = await api.get(URL)
	return response.data ? response.data : null
}

//#endregion
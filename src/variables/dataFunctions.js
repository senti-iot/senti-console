import { servicesAPI } from './data';

//#region V2

/**
 * Get all cloud functions
 * @func getAllFunctions
 */
export const getAllFunctions = async () => {
	let data = await servicesAPI.get('/v2/cloudfunctions').then(rs => rs.ok ? rs.data : [])
	return data ? data : []
}
/**
 * Get Cloud function
 * @func getFunction
 * @param {UUIDv4} uuid
 */
export const getFunction = async (uuid) => {
	let data = await servicesAPI.get(`/v2/cloudfunction/${uuid}`).then(rs => rs.ok ? rs.data : null)
	return data
}
/**
 * Create Cloud Function
 * @func createFunction
 * @param {object} func
 */
export const createFunction = async (func) => {
	let response = await servicesAPI.post('/v2/cloudfunction', func).then(rs => rs.ok ? rs.data : false)
	return response
}
/**
 * Update Cloud Function
 * @func updateFunction
 * @param {object} func
 */
export const updateFunction = async (func) => {
	let response = await servicesAPI.put(`/v2/cloudfunction`, func).then(rs => rs.ok ? rs.data : false)
	return response
}

/**
 * Delete a Cloud Function
 * @func deleteFunction
 * @param {UUIDv4} uuid - Function ID
 */
export const deleteCFunction = async (uuid) => {
	let response = await servicesAPI.delete(`/v2/cloudfunction/${uuid}`).then(rs => rs.ok)
	return response
}
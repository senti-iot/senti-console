import { servicesAPI } from './data';
/**
 * Get Device Types
 * @func getAllDeviceTypes
 */
export const getAllDeviceTypes = async () => {
	let data = []
	data = await servicesAPI.get('/v2/devicetypes').then(rs => rs.ok ? rs.data : [])
	return data
}

/**
 * Get Device Type based on UUID
 * @func getDeviceType
 * @param {UUIDv4} uuid UUID of a device type
 */
export const getDeviceType = async (uuid) => {
	let data = await servicesAPI.get(`/v2/devicetype/${uuid}`).then(rs => rs.ok ? rs.data : null)
	return data
}

/**
 * Create Device Type
 * @function createDeviceType
 * @param {object} dt - Device Type
 */
export const createDeviceType = async (dt) => {
	let response = await servicesAPI.post('/v2/devicetype', dt).then(rs => rs.ok ? rs.data : false)
	return response
}

/**
 * Update Device Type
 * @func updateDeviceType
 * @param {object} dt - Device Type
 */
export const updateDeviceType = async (dt) => {
	let response = await servicesAPI.put(`/v2/devicetype`, dt).then(rs => rs.ok ? rs.data : false)
	return response
}

/**
 * Delete Device Type
 * @func deleteDeviceType
 * @param {UUIDv4} uuid - Device Type UUID
 */
export const deleteDeviceType = async (uuid) => {
	let response = await servicesAPI.delete(`/v2/devicetype/${uuid}`).then(rs => rs.ok)
	return response
}
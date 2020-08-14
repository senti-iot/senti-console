import { servicesAPI } from './data';

// export const getAllRegistries = async (customerID, su) => {
// 	let response = []
// 	if (su)
// 		response = await servicesAPI.get('/v1/registries').then(rs => rs.ok ? rs.data : [])
// 	else
// 		response = await servicesAPI.get(`/v1/${customerID}/registries`).then(rs => rs.ok ? rs.data : [])
// 	return response
// }

// export const createRegistry = async (reg) => {
// 	let response = await servicesAPI.put('/v1/registry', reg).then(rs => rs.ok ? rs.data : false)
// 	return response
// }

// export const updateRegistry = async (reg) => {
// 	let response = await servicesAPI.post(`/v1/registry`, reg).then(rs => rs.ok ? rs.data : false)
// 	return response
// }

// export const getRegistry = async (id, customerID, ua) => {
// 	let data = await servicesAPI.get(`/v1/registry/${id}`).then(rs => rs.ok ? rs.data : null)
// 	let devices = await getRegistryDevices(id)
// 	if (data) {
// 		data.devices = devices
// 	}
// 	return data
// }
// export const getRegistryDevices = async (id) => {
// 	let data = await servicesAPI.get(`/v1/registry/${id}/devices`).then(rs => rs.ok ? rs.data : null)
// 	return data
// }

// export const deleteRegistry = async (uuid) => {
// 	let data = await servicesAPI.post(`/v1/delete-registry/${uuid}`).then(rs => rs.ok)
// 	return data
// }

export const getAllMessages = async cId => {
	let response
	if (cId) {
		response = await servicesAPI.get(`/v1/messages/${cId}`).then(rs => rs.ok ? rs.data : rs.ok)
	}
	else {
		response = await servicesAPI.get(`/v1/messages/`).then(rs => rs.ok ? rs.data : rs.ok)
	}
	return response
}



/**
 * V2
 */

/**
 * GET All Registries
 */
export const getAllRegistries = async () => {
	let response = await servicesAPI.get('/v2/registries').then(rs => rs.ok ? rs.data : null)
	return response
}
/**
 * GET Registries under a specific org
 * @param {UUIDv4} orgUUID - Organisation UUID
 */
export const getOrgRegistries = async (orgUUID) => {
	let response = await servicesAPI.get(`/v2/registries/${orgUUID}`).then(rs => rs.ok ? rs.data : null)
	return response
}

/**
 * GET Registry
 * @param {UUIDv4} uuid - Registry UUID
 */
export const getRegistry = async (uuid) => {
	let response = await servicesAPI.get(`/v2/registry/${uuid}`).then(rs => rs.ok ? rs.data : null)
	let devices = await servicesAPI.get(`/v2/devices/${uuid}`).then(rs => rs.ok ? rs.data : null)
	if (response )
		return { ...response, devices: devices }
	return null
}

/**
 * POST - Create Registry
 * @param {object} registry
 */
export const createRegistry = async (registry) => {
	let response = await servicesAPI.post(`/v2/registry`, registry).then(rs => rs.ok ? rs.data : null)
	return response
}

/**
 * PUT - Update Registry
 * @param {object} registry
 */
export const updateRegistry = async registry => {
	let response = await servicesAPI.put(`/v2/registry`, registry).then(rs => rs.ok ? rs.data : null)
	return response
}

/**
 * DELETE - Delete Registry
 * @param {UUIDv4} uuid - Registry UUID
 */
export const deleteRegistry = async uuid => {
	let response = await servicesAPI.delete(`/v2/registry/${uuid}`).then(rs => rs.ok ? rs.data : null)
	return response
}

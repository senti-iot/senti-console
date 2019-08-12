import { servicesAPI, externalAPI } from './data';

export const getAllRegistries = async (customerID, su) => {
	let response = []
	if (su)
		response = await servicesAPI.get('/v1/registries').then(rs => rs.ok ? rs.data : [])
	else
		response = await servicesAPI.get(`/v1/${customerID}/registries`).then(rs => rs.ok ? rs.data : [])
	return response
}

export const createRegistry = async (reg) => {
	let response = await servicesAPI.put('/v1/registry', reg).then(rs => rs.ok ? rs.data : false)
	return response
}

export const updateRegistry = async (reg) => {
	let response = await servicesAPI.post(`/v1/registry`, reg).then(rs => rs.ok ? rs.data : false)
	return response
}

export const getRegistry = async (id, customerID, ua) => {
	let data = await servicesAPI.get(`/v1/registry/${id}`).then(rs => rs.ok ? rs.data : null)
	let devices = await getRegistryDevices(id)
	if (data) {
		data.devices = devices
	}
	return data
}
export const getRegistryDevices = async (id) => {
	let data = await servicesAPI.get(`/v1/registry/${id}/devices`).then(rs => rs.ok ? rs.data : null)
	return data
}

export const deleteRegistry = async (uuid) => {
	let data = await servicesAPI.post(`/v1/delete-registry/${uuid}`).then(rs => rs.ok)
	return data
}

export const getAllMessages = async cId => {
	let response = await servicesAPI.get(`/v1/messages/${cId}`).then(rs => rs.ok ? rs.data : rs.ok)
	return response
}

export const getAllTokens = async userId => {
	let response = await externalAPI.get(`/tokens/${userId}`).then(rs => rs.ok ? rs.data : [])
	return response
}

export const generateToken = async token => {
	let response = await externalAPI.post(`/generateToken`, token).then(rs => rs.ok ? rs.data : null)
	return response
}

export const deleteTokens = async tokens => {
	let response = Promise.all(tokens.map(t => externalAPI.post(`/deletetoken/${t}`))).then(rs => {
		if (rs.find(f => f === false))
			return false
		else
			return true
	})
	return response
}
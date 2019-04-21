import { servicesAPI } from './data';

export const getAllRegistries = async () => {
	let data = await servicesAPI.get('/v1/1/registries').then(rs => rs.ok ? rs.data : null)
	return data
}

export const createRegistry = async (reg) => {
	let response = await servicesAPI.put('/v1/registry', reg).then(rs => rs.ok ? rs.data : false) 
	return response
}

export const updateRegistry = async (reg) => { 
	let response = await servicesAPI.post('/v1/registry', reg).then(rs => rs.ok ? rs.data : false)
	return response
}

export const getRegistry = async (customerID, id) => {
	let data = await servicesAPI.get(`/v1/${customerID}/registry/${id}`).then(rs => rs.ok ? rs.data : null)
	return data
}
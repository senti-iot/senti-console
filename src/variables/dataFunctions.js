import { cloudAPI } from './data';

export const getAllFunctions = async (customerID, ua) => {
	let data = []
	if (ua) {
		data = await cloudAPI.get('/v1/fs').then(rs => rs.ok ? rs.data : [])
	}
	else {
		data = await cloudAPI.get(`/v1/fs/${customerID}/devicetypes`).then(rs => rs.ok ? rs.data : [])
	}
	return data
}
export const getFunction = async (id, customerID, ua) => {
	let data = await cloudAPI.get(`/v1/f/${id}`).then(rs => rs.ok ? rs.data : null)
	return data
}
export const createFunction = async (dt) => {
	let response = await cloudAPI.put('/v1/f', dt).then(rs => rs.ok ? rs.data : false)
	return response
}
export const updateFunction = async (dt) => {
	let response = await cloudAPI.post(`/v1/f`, dt).then(rs => rs.ok ? rs.data : false)
	return response
}
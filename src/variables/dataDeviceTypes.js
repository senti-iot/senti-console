import { servicesAPI } from './data';

export const getAllDeviceTypes = async (customerID, ua) => {
	let data = []
	if (ua) {
		data = await servicesAPI.get('/v1/devicetypes').then(rs => rs.ok ? rs.data : [])
	}
	else {
		data = await servicesAPI.get(`/v1/${customerID}/devicetypes`).then(rs => rs.ok ? rs.data : [])
	}
	return data
}
export const getDeviceType = async (id) => {
	let data = await servicesAPI.get(`/v1/1/devicetype/${id}`).then(rs => rs.ok ? rs.data : null)
	return data
}
export const createDeviceType = async (dt) => {
	let response = await servicesAPI.put('/v1/devicetype', dt).then(rs => rs.ok ? rs.data : false)
	return response
}
export const updateDeviceType = async (dt) => {
	let response = await servicesAPI.post(`/v1/devicetype`, dt).then(rs => rs.ok ? rs.data : false)
	return response
}

export const deleteDeviceType = async (id) => {
	let response = await servicesAPI.post(`/v1/delete-device-type/${id}`).then(rs => rs.ok)
	return response
}
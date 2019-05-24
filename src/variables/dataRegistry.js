import { servicesAPI } from './data';
import moment from 'moment';

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
	let response = await servicesAPI.post(`/v1/deviceType/${dt.id}`, dt).then(rs => rs.ok ? rs.data : false)
	return response
}


export const getAllSensors = async (customerID, ua) => {
	let response = []
	if (ua) {
		response = await servicesAPI.get(`/v1/devices`).then(rs => rs.ok ? rs.data : [])
	}
	else {
		response = await servicesAPI.get(`/v1/${customerID}/devices`).then(rs => rs.ok ? rs.data : [])
	}
	return response
}

export const getSensor = async (id, customerID, ua) => {
	let response = null
	// if (ua)
	response = await servicesAPI.get(`/v1/device/${id}`).then(rs => rs.ok ? rs.data : null)
	// else
	// response = await servicesAPI.get(`v1/${customerID}/device/${id}`).then(rs => rs.ok ? rs.data : null)
	return response
}

export const createSensor = async (sensor) => {
	let response = await servicesAPI.put(`/v1/1/device`).then(rs => rs.ok ? rs.data : null)
	return response
}

export const getSensorDataClean = async (id, from, to, v, nId) => {
	console.log(id, from, to, v, nId)
	if (nId === undefined) {
		console.trace()
	}
	// console.log(moment(from, 'YYYY-MM-DD+HH:mm'))
	let startDate = moment(from, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(to, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let response = await servicesAPI.get(`/v1/devicedata-clean/${id}/${startDate}/${endDate}/${v}/${nId}`).then(rs => rs.ok ? rs.data : rs.ok)
	// console.log(response)
	return response
}

export const getSensorData = async (id) => {
	let response = await servicesAPI.get(`/v1/devicedata/${id}`).then(rs => rs.ok ? rs.data : rs.ok)
	return response
}
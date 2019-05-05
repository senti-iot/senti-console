import { servicesAPI } from './data';
import moment from 'moment';

export const getAllRegistries = async () => {
	let data = await servicesAPI.get('/v1/1/registries').then(rs => rs.ok ? rs.data : null)
	return data
}

export const createRegistry = async (reg) => {
	let response = await servicesAPI.put('/v1/registry', reg).then(rs => rs.ok ? rs.data : false)
	console.log(response)
	return response
}

export const updateRegistry = async (reg) => {
	let response = await servicesAPI.post(`/v1/registry`, reg).then(rs => rs.ok ? rs.data : false)
	return response
}

export const getRegistry = async (customerID, id) => {
	let data = await servicesAPI.get(`/v1/${customerID}/registry/${id}`).then(rs => rs.ok ? rs.data : null)
	let devices = await getRegistryDevices(customerID, id)
	if (data) {
		data.devices = devices
	}
	return data
}
export const getRegistryDevices = async (customerID, id) => {
	let data = await servicesAPI.get(`/v1/${customerID}/registry/${id}/devices`).then(rs => rs.ok ? rs.data : null)
	return data 
}

export const getAllDeviceTypes = async () => {
	let data = await servicesAPI.get('/v1/1/devicetypes').then(rs => rs.ok ? rs.data : null)
	return data
}
export const getDeviceType = async (id) => { 
	let data = await servicesAPI.get(`/v1/1/devicetype/${id}`).then(rs => rs.ok ? rs.data : null)
	return data
}
export const createDeviceType = async (dt) => {
	let response = await servicesAPI.put('/v1/devicetype', dt).then(rs => rs.ok ? rs.data : false)
	console.log(response)
	return response
}
export const updateDeviceType = async (dt) => { 
	let response = await servicesAPI.post(`/v1/deviceType/${dt.id}`, dt).then(rs => rs.ok ? rs.data : false)
	return response
}


export const getAllSensors = async () => { 
	let response = await servicesAPI.get(`/v1/1/devices`).then(rs => rs.ok ? rs.data : [])
	return response
}

export const getSensor = async (id) => { 
	let response = await servicesAPI.get(`/v1/1/device/${id}`).then(rs => rs.ok ? rs.data : null)
	return response
}

export const createSensor = async (sensor) => {
	let response = await servicesAPI.put(`/v1/1/device`).then(rs => rs.ok ? rs.data : null)
	return response
}

export const getSensorDataClean = async (id, from, to) => {
	// console.log(moment(from, 'YYYY-MM-DD+HH:mm'))
	let response = await servicesAPI.get(`/v1/devicedata-clean/${id}/${moment(from, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm')}/${moment(to, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm')}`).then(rs => rs.ok ? rs.data : rs.ok)
	console.log(response)
	return response
}

export const getSensorData = async (id) => {
	let response = await servicesAPI.get(`/v1/devicedata/${id}`).then(rs => rs.ok ? rs.data : rs.ok)
	return response
}
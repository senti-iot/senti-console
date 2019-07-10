import { servicesAPI, externalAPI } from './data';
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
	let response = await servicesAPI.post(`/v1/devicetype`, dt).then(rs => rs.ok ? rs.data : false)
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
	let response = await servicesAPI.put(`/v1/device`, sensor).then(rs => rs.ok ? rs.data : null)
	return response
}
export const updateSensor = async (sensor) => {
	let response = await servicesAPI.post(`v1/device`, sensor).then(rs => rs.data)
	return response
}
export const getSensorDataClean = async (id, from, to, v, nId, deviceType, chartType, calc) => {
	if (nId === undefined) {
		console.trace()
	}
	// console.log(moment(from, 'YYYY-MM-DD+HH:mm'))
	let startDate = moment(from, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(to, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let url, response;
	if (deviceType) {
		url = `/v1/devicedata-clean/${id}/${startDate}/${endDate}/${v}/${nId}/${deviceType}/${chartType}`
		response = await servicesAPI.get(url).then(rs => rs.ok ? rs.data : rs.ok)
		if (calc === 'total') {
			return response.total
		}
		return response.avrg
	}
	else {
		url = `/v1/devicedata-clean/${id}/${startDate}/${endDate}/${v}/${nId}`
		response = await servicesAPI.get(url).then(rs => rs.ok ? rs.data : rs.ok)
		return response
	}
}

export const getSensorData = async (id) => {
	let response = await servicesAPI.get(`/v1/devicedata/${id}`).then(rs => rs.ok ? rs.data : rs.ok)
	return response
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
		console.log(rs)
		if (rs.find(f => f === false))
			return false
		else 
			return true
	})
	return response
}
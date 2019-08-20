
import { servicesAPI } from './data';
import moment from 'moment';

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
	let response = await servicesAPI.post(`/v1/device`, sensor).then(rs => rs.data)
	return response
}

export const deleteSensor = async (uuid) => {
	let response = await servicesAPI.post(`/v1/delete-device/${uuid}`).then(rs => rs.ok)
	return response
}

export const getSensorDataClean = async (id, from, to, v, nId, deviceType, chartType, calc) => {
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

export const getSensorMessages = async (id, period) => {
	let startDate = moment(period.from, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let endDate = moment(period.to, 'YYYY-MM-DD+HH:mm').format('YYYY-MM-DD HH:mm:ss')
	let response = await servicesAPI.get(`/v1/messages/device/${id}/${startDate}/${endDate} `).then(rs => rs.ok ? rs.data : rs.ok)
	return response
}

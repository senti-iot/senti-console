
import { servicesAPI, dawaApi } from './data';
import moment from 'moment';


/**
 * Get All Sensors available to the user
 */
export const getAllSensors = async () => {
	let response = []
	response = await servicesAPI.get(`/v2/devices`).then(rs => rs.ok ? rs.data : [])
	return response
}

/**
 * Get All Sensors under an org
 * @param {UUIDv4} orgUUID - Organisation UUID
 */
export const getAllOrgSensors = async (orgUUID) => {
	let response = []
	response = await servicesAPI.get(`/v2/devices/${orgUUID}`).then(rs => rs.ok ? rs.data : [])
	return response
}

/**
 * Get Sensor
 * @param {UUIDv4} uuid Device UUID
 */
export const getSensor = async (uuid) => {
	let response = await servicesAPI.get(`/v2/device/${uuid}`).then(rs => rs.ok ? rs.data : null)
	return response
}

/**
 * Create Sensor
 * @param {object} sensor
 */
export const createSensor = async (sensor) => {
	let response = await servicesAPI.post(`/v2/device`, sensor).then(rs => rs.ok ? rs.data : null)
	return response
}
/**
 * Update Sensor
 * @param {object} sensor
 */
export const updateSensor = async (sensor) => {
	let response = await servicesAPI.put(`/v2/device`, sensor).then(rs => rs.data)
	return response
}

/**
 * Delete Sensor
 * @param {UUIDv4} uuid Sensor UUID
 */
export const deleteSensor = async (uuid) => {
	let response = await servicesAPI.delete(`/v2/device/${uuid}`).then(rs => rs.ok)
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

export const getAddressByLocation = async (lat, long) => {
	let URL = `adgangsadresser/reverse?x=${long}&y=${lat}&struktur=mini`
	let response = await dawaApi.get(URL).then(rs => rs)
	return response.data
}
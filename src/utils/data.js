import { create } from 'apisauce'

var loginApi = create({
	baseURL: 'http://senti.cloud/rest/odeum/',
	timout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	mode: 'no-cors'
})
// Define the API
const api = create({
	baseURL: 'http://senti.cloud/rest/senti/',
	// baseURL: 'http://api.dashboard.senti.cloud/web/',
	// baseURL: 'http://localhost:80',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	mode: 'no-cors'
})
// Login
export const loginUser = async (username, password) => {
	var data = await loginApi.post('/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return data
}
export const createOneProject = async (project) => {
	var data = await api.post('/project', JSON.stringify(project)).then(response => response.data)
	return data
}
export const getAllProjects = async () => {
	var data = await api.get('/projects').then((response => { return response.data }))
	return data
}

// Get devices for Project
export const getDevicesForProject = async (projectId) => {
	var data = await api.get('/device/' + projectId).then((response) => response.data)
	if (data instanceof Array)
		return data
	else {
		if (data === null)
			return null
		else
			return [data]
	}
}
// Get available devices
export const getAvailableDevices = async () => {
	var data = await api.get('/availabledevices').then(rs => rs.data)
	return data
}
//Get Device Registrations for Project

export const getDeviceRegistrations = async (deviceIds, pId) => {
	var data = await api.get('/devicereg/' + deviceIds + '/' + pId).then(rs => rs.data)
	return data ? data.sort((a, b) => a.reg_date > b.reg_date ? -1 : a.reg_date < b.reg_date ? 1 : 0) : []
}

// Delete projects
export const deleteProject = async (projectIds) => {
	for (let i = 0; i < projectIds.length; i++) {
		var res = await api.delete('/project/' + projectIds[i])
	}
	return res
}

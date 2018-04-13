import { create } from 'apisauce'

// Define the API
const api = create({
	baseURL: 'http://api.dashboard.senti.cloud/web/',
	// baseURL: 'http://localhost:80',
	timeout: 10000,
	headers: {
		'Content-Type': 'application/json',
		'Accept': 'application/json'
	},
	mode: 'no-cors'
})

export const createOneProject = async (project) => {
	var data = await api.post('/project/create.php', JSON.stringify(project)).then(response => console.log(response.data))
	return data
}
export const getAllProjects = async () => {
	var data = await api.get('/project/read.php').then((response => { return response.data }))
	console.log(data)
	return data
}
// Post a Help Item
export const postHelpItem = (helpItem) => {
	var data = JSON.stringify(helpItem)
	// console.log(helpItem)
	api.post('/helpitems', data).then((response => console.log(response.status)))
}
// Get devices for Project
export const getDevicesForProject = async (projectId) => {
	var data = await api.get('/devices/read_projects.php?pid=' + projectId).then((response) => response.data)
	// console.log(data)
	return data
}

//Get Device Registrations for Project

export const getDeviceRegistrations = async (projectId, deviceIds) => {
	var data = []
	deviceIds.forEach(async dId => {
		var d = await api.get('/devices/read_regs.php?pid=' + projectId + '&did=' + dId).then((response) => response.data)
		console.log(d)
		if (d !== null)
			data.push(...d)
	})
	console.log(data)
}

// Dekete a Project
export const deleteProject = async (projectIds) => {
	for (let i = 0; i < projectIds.length; i++) {
		var res = await api.post('/project/delete.php', { id: projectIds[i] })
	}
	console.log(res)
	return res
}
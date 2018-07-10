import { api } from "./data";
import { getSimpleAddress } from "./dataDevices";

export const createOneProject = async (project) => {
	var data = await api.post('senti/project', project).then(response => response.data)
	return data
}
export const updateProject = async (project) => {
	var data = await api.put('senti/project', project).then(response => response)
	console.log(data)
	return data.data
}
export const getAllProjects = async () => {
	var data = await api.get('senti/projects').then((response => { return response.data }))
	return data
}

export const getProject = async (projectId) => {
	var data = await api.get('senti/project/' + projectId).then(rs => rs.data)
	data.devices.map(async d => {
		return d.address ? null : d.address = await getSimpleAddress(d.lat, d.long)
	})
	return data
}

export const deleteProject = async (projectIds) => {
	for (let i = 0; i < projectIds.length; i++) {
		var res = await api.delete('senti/project/' + projectIds[i])
	}
	return res
}
import { api } from './data';


export const getCreateProject = async () => {
	var data = await api.get('senti/project/create').then(response => response.data)
	return data
}
export const createProject = async (project) => {
	var data = await api.post('senti/project', project).then(rs => rs.data)
	return data
}
export const updateProject = async (project) => {
	var data = await api.put(`senti/project/${project.id}`, project).then(response => response)
	return data.data
}
export const getAllProjects = async () => {
	var data = await api.get('senti/projects').then((response => { return response.data }))
	return data
}

export const getProject = async (projectId) => {
	var data = await api.get('senti/project/' + projectId).then(rs => rs.data)
	return data
}

export const deleteProject = async (projectIds) => {
	for (let i = 0; i < projectIds.length; i++) {
		var res = await api.delete('senti/project/' + projectIds[i])
	}
	return res
}
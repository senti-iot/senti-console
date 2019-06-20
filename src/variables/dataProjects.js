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
	var data = await api.get('senti/projects').then((response => { return response.data ? response.data : [] }))
	console.log(data)
	return data
}

export const getProject = async (projectId) => {
	var data = await api.get('senti/project/' + projectId).then(rs => rs.data)
	return data
}

export const deleteProject = async (projectId) => {
	var data = await api.delete('senti/project/' + projectId)
	return data
}
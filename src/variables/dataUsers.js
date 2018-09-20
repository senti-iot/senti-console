import { api } from './data'

//#region GET User,Users,Org,Orgs
export const getAllUsers = async () => {
	var data = await api.get('core/users').then(rs => rs.data)
	// console.log('getAllUsers', data)
	return data
}

export const getUser = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs.data)
	// console.log('getUser', userId, data)
	return data
}

export const getAllOrgs = async () => {
	var data = await api.get(`core/orgs`).then(rs => rs.data)
	// console.log('getOrgs', data)
	return data
}

export const getOrg = async(orgId) => {
	var data = await api.get(`core/org/${orgId}`).then(rs => rs.data)
	// console.log('getOrg', orgId, data)
	return data
}
export const updateOrg = async(org) => {
	var data = await api.put(`core/org/${org.id}`, org).then(rs => rs.data)
	return data
}
export const createOrg = async (org) => {
	var result = await api.post('core/org/', org)
	return result
}

//#endregion
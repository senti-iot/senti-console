import { api, setToken } from "./data";

export const getOrgs = async () => {
	var orgs = await api.get('core/orgs').then(rs => rs.data)
	return orgs
}
export const getUsers = async (orgId) => {
	var users = await api.get('core/users/' + (orgId ? orgId : '')).then(rs => rs.data)
	return users
}
export const createUser = async (data) => {
	var newUser = await api.put('core/user', JSON.stringify(data))
	return newUser.ok
}
export const createOrg = async (data) => {
	var newOrg = await api.put('core/org', JSON.stringify(data))
	return newOrg
}
export const getUserInfo = async (userID) => {
	setToken()
	var user = await api.get('core/user/' + userID).then(rs => rs.data)
	return user
}

export const deleteOrgs = async (orgIds) => {
	var result = false
	await orgIds.forEach(async orgId => {
		result = await api.delete('core/org/' + orgId)
	})
	return result
}


export const deleteUsers = async (userIds) => {
	var result = false
	await userIds.forEach(async uId => {
		result = await api.delete('core/user/' + uId)
	})
	return result
}

export const updateUser = async (user) => {
	var result = await api.post('core/user', user)
	return result
}
import { api } from './data'
import { del } from './storage';

//#region GET User,Users
export const getAllUsers = async () => {
	var data = await api.get('core/users').then(rs => rs.data)
	data.forEach(d => {
		if (d.aux) {
			delete d.aux.favorites
			delete d.aux.settings
		}
	})
	return data
}
export const getValidSession = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs)
	return data
}
export const getUser = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs.data)
	return data
}
export const createUser = async (user) => {
	let response = await api.post(`core/user`, user).then(rs => rs)
	return response.data ? response.data : response.status
}
export const resendConfirmEmail = async (user) => {
	let data = await api.post('core/user/resendconfirmmail', user).then(rs => rs.data)
	return data
}
export const confirmUser = async (obj) => {
	let response = await api.post(`core/user/confirm`, obj).then(rs => rs)
	return response.ok ? response.data : response.status 
}
export const editUser = async (user) => {
	let data = await api.put(`core/user/${user.id}`, user).then(rs => rs.data)
	return data
}

export const deleteUser = async (user) => {
	let data = await api.delete(`core/user/${user}`).then(rs => rs.data)
	del('user.' + user)
	return data
}

//#endregion
import { api, coreServicesAPI } from './data'
import { del } from './storage'

//#region GET USERS Senti


export const getValidSession = async (userId) => {
	var data = await api.get(`core/user/${userId}`).then(rs => rs)
	return data
}

// export const createUser = async (user) => {
// 	let response = await api.post(`core/user`, user).then(rs => rs)
// 	return response.data ? response.data : response.status
// }
export const resendConfirmEmail = async (user) => {
	let data = await api.post('core/user/resendconfirmmail', user).then(rs => rs.data)
	return data
}
// export const confirmUser = async (obj) => {
// 	let response = await api.post(`core/user/confirm`, obj).then(rs => rs)
// 	return response.ok ? response.data : response.status
// }

//#region Senti Core API
export const createUser = async (user) => {
	var res = await coreServicesAPI.post(`entity/user`, user).then(rs => rs)
	return res
}
export const confirmUser = async (obj) => {
	console.log(obj)
	let response = await coreServicesAPI.post(`entity/user/confirm`, obj).then(rs => rs.ok ? rs.data : rs.ok)
	return response
}
export const getUser = async (userId) => {
	// var data = await api.get(`core/user/${userId}`).then(rs => rs.data)
	var data = await coreServicesAPI.get(`entity/user/${userId}`).then(rs => rs.ok ? rs.data : rs.ok)
	return data
}

export const editUser = async (user) => {
	// let data = await api.put(`core/user/${user.id}`, user).then(rs => rs.data)
	let data = await coreServicesAPI.put(`entity/user/${user.uuid}`, user).then(rs => rs.ok)
	return data
}
/**
 * DELETE '/v2/entity/user/:uuid'
 */
export const deleteUser = async (user) => {
	// let data = await api.delete(`core/user/${user}`).then(rs => rs.data)0
	let data = await coreServicesAPI.delete(`entity/user/${user}`).then(rs => rs.ok)
	del('user.' + user)
	return data
}
/**
 * This function modifies the internal key of the user
 * @param {Object} s - Internal Object
 * @param {String} uuid - UUID of the user
 */
export const setInternal = async (s, uuid) => {
	let data = await coreServicesAPI.put(`/entity/user/${uuid}/internal`, s).then(rs => rs.ok)
	return data
}
export const getLoginUser = async (uuid) => {
	let data = await coreServicesAPI.get(`auth/user`).then(rs => rs.data)
	return data
}
//#region GET User,Users
export const getAllUsers = async () => {
	var data = await coreServicesAPI.get('entity/users').then(rs => rs.data)
	return data ? data : []
}
//#endregion
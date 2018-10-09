import { loginApi, api } from "./data";
import cookie from "react-cookies";

export const loginUser = async (username, password) => {
	var session = await loginApi.post('odeum/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}
export const logOut = async () => {
	var session = cookie.load('SESSION')
	var data = await loginApi.delete('odeum/auth/basic', JSON.stringify(session.sessionID))
	cookie.remove('SESSION')
	return data
}

export const resetPassword = async(obj) => {
	let data = await api.post(`/core/user/forgotpassword`, obj).then(rs => rs.data)
	console.log('resetPassword', data)
	return data
}
export const confirmPassword = async (obj) => {
	let data = await api.post(`/core/user/forgotpassword/set`, obj).then(rs => rs.data)
	console.log('confirmPassword', data)
	return data
}
export const setPassword = async (obj) => {
	let data = await api.post(`/core/user/setpassword`, obj).then(rs => rs.data)
	console.log('setPassword', data)
	return data
}
export const getSettingsFromServer = async () => {
	var data = await api.get('senti/users/settings').then(rs => rs.data)
	return JSON.parse(data)
}

export const saveSettings = async (user) => {
	var data = await api.put(`/core/user/${user.id}`, user).then(rs => rs.data)
	return data
}
export const saveSettingsOnServer = async (settings) => {
	var data = await api.post('senti/users/settings', JSON.stringify(settings)).then(rs => { 
		return rs.data
	})
	return data
}
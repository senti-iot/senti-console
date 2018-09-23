import { loginApi, api } from "./data";
import cookie from "react-cookies";

export const loginUser = async (username, password) => {
	var session = await loginApi.post('odeum/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}
export const logOut = async () => {
	var session = cookie.load('loginData')
	var data = await loginApi.delete('odeum/auth/basic', JSON.stringify(session.sessionID))
	cookie.remove('loginData')
	return data
}

export const getSettingsFromServer = async () => {
	var data = await api.get('senti/users/settings').then(rs => rs.data)
	return JSON.parse(data)
}

export const saveSettings = async (user) => {
	var data = await api.put('/senti/user', user).then(rs => rs.data)
	console.loginApi(data)
	return data
}
export const saveSettingsOnServer = async (settings) => {
	var data = await api.post('senti/users/settings', JSON.stringify(settings)).then(rs => { 
		return rs.data
	})
	return data
}
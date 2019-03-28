import { loginApi, api } from './data';
import cookie from 'react-cookies';

/**
 * 
 * @param {String} username 
 * @param {String} password 
 */
export const loginUser = async (username, password) => {
	var session = await loginApi.post('odeum/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
	return session
}
export const loginUserViaGoogle = async (token) => { 
	var session = await api.post('senti/googleauth', { id_token: token }).then(rs => rs.data)
	return session
}
/**
 * @function logOut Log out function
 */
export const logOut = async () => {
	var session = cookie.load('SESSION')
	var data = await loginApi.delete(`odeum/auth/${session.sessionID}`)
	cookie.remove('SESSION')
	return data
}
/**
 * 
 * @param {object} obj 
 * @param {String} obj.email User's e-mail
 */
export const resetPassword = async(obj) => {
	let response = await api.post(`/core/user/forgotpassword`, obj).then(rs => rs)
	return response.ok ? response.data : response.status
}
/**
 * 
 * @param {object} obj 
 * @param {String} obj.newPassword New Password
 * @param {String} obj.passwordToken Confirm new password token
 */
export const confirmPassword = async (obj) => {
	let response = await api.post(`/core/user/forgotpassword/set`, obj).then(rs => rs)
	return response.ok ? response.data : response.status
}
/**
 * 
 * @param {object} obj 
 * @param {String} obj.id User ID
 * @param {String} obj.oldPassword Old Password - Not required
 * @param {String} obj.newPassword New Password
 */
export const setPassword = async (obj) => {
	let data = await api.post(`/core/user/setpassword`, obj).then(rs => rs.data)
	return data
}
/**
 * 
 * @param {object} user 
 * @param {object} user.aux - Required
 * @param {object} user.aux.senti
 * @param {object} user.aux.odeum
 */
export const saveSettings = async (user) => {
	var data = await api.put(`/core/user/${user.id}`, user).then(rs => rs.data)
	return data
}
import { api, coreServicesAPI } from './data'
import cookie from 'react-cookies'

/**
 *
 * @param {String} username
 * @param {String} password
 */
// export const loginUser = async (username, password) => {
// 	var session = await loginApi.post('odeum/auth/basic', JSON.stringify({ username: username, password: password })).then(rs => rs.data)
// 	return session
// }
export const nLoginUser = async (username, password) => {
	var session = await coreServicesAPI.post('/auth/basic', { username, password }).then(rs => rs.data)
	return session
}
export const nGoogleLogin = async (token) => {
	var session = await coreServicesAPI.post('/auth/google', { id_token: token }).then(rs => rs.data)
	return session
}
// export const loginUserViaGoogle = async (token) => {
// 	var session = await api.post('senti/googleauth', { id_token: token }).then(rs => rs.data)
// 	return session
// }
/**
 * @function logOut Log out function
 */
export const logOut = async () => {
	cookie.remove('SESSION', { path: '/' })
	return true
}
/**
 *
 * @param {object} obj
 * @param {String} obj.email User's e-mail
 */
export const resetPassword = async (obj) => {
	let response = await coreServicesAPI.post(`entity/user/forgotpassword`, obj).then(rs => rs)
	return response.ok
}
/**
 *
 * @param {object} obj
 * @param {String} obj.newPassword New Password
 * @param {String} obj.passwordToken Confirm new password token
 */
export const confirmPassword = async (obj) => {
	let response = await coreServicesAPI.post(`entity/user/forgotpassword/set`, obj).then(rs => rs)
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
	let data = await api.post(`entity/user/${obj.uuid}`, obj).then(rs => rs.data)
	return data
}
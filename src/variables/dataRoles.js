import { coreServicesAPI } from 'variables/data'


/**
 * @function async Get User roles available
 */
export const getRoles = async () => {
	let roles = await coreServicesAPI.get('/entity/roles').then(rs => rs.ok ? rs.data : rs.ok)
	return roles
}
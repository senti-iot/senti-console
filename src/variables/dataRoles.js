import { coreServicesAPI } from 'variables/data'



export const getRoles = async () => {
	let roles = await coreServicesAPI.get('/entity/roles').then(rs => rs.ok ? rs.data : rs.ok)
	console.log('Roles', roles)
	return roles
}
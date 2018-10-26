import { api } from './data'

export const getAllOrgs = async () => {
	var data = await api.get(`core/orgs`).then(rs => rs.data)
	return data
}

export const getOrg = async (orgId) => {
	var data = await api.get(`core/org/${orgId}`).then(rs => rs.data)
	return data
}
export const getOrgUsers = async (orgId) => {
	var data = await api.get(`core/org/users/${orgId}`).then(rs => rs.data)
	return data
}
export const updateOrg = async (org) => {
	var data = await api.put(`core/org/${org.id}`, org).then(rs => rs.data)
	return data
}
export const createOrg = async (org) => {
	var result = await api.post('core/org', org).then(rs => rs.data)
	return result
}
export const deleteOrg = async (org) => {
	var result = await api.delete(`core/org/${org}`).then(rs => rs)
	return result
}
// export const getCreateOrg = async () => {
// 	var result = await api.get('core/org/empty')
// 	return result
// }
//#endregion
import { api } from './data'

/**
 * @function getAllOrgs Get all organizations
 */
export const getAllOrgs = async () => {
	var data = await api.get(`core/orgs`).then(rs => rs.data)
	return data
}

/**
 * @function getOrg Get an organization based on ID
 * @param {int} orgId Organization ID
 */
export const getOrg = async (orgId) => {
	var data = await api.get(`core/org/${orgId}`).then(rs => rs.data)
	return data
}

/**
 * @function getOrgUsers Get Organization's users
 * @param {int} orgId Organization ID
 */
export const getOrgUsers = async (orgId) => {
	var data = await api.get(`core/org/users/${orgId}`).then(rs => rs.data)
	return data
}

/**
 * @function updateOrg Update an organization
 * @param {object} org 
 */
export const updateOrg = async (org) => {
	var data = await api.put(`core/org/${org.id}`, org).then(rs => rs.data)
	return data
}

/**
 * @function createOrg Create an organization
 * @param {object} org 
 */
export const createOrg = async (org) => {
	var result = await api.post('core/org', org).then(rs => rs.data)
	return result
}

/**
 * @function deleteOrg Delete an Organization
 * @param {object} org 
 */
export const deleteOrg = async (org) => {
	var result = await api.delete(`core/org/${org}`).then(rs => rs)
	return result
}

import { servicesAPI, coreServicesAPI } from './data'
import { del } from './storage'

/**
 * @function getAllOrgs Get all organizations
 */
export const getAllOrgs = async () => {
	// var data = await api.get(`core/orgs`).then(rs => rs.data)
	var data = await coreServicesAPI.get('/entity/organisations').then(rs => rs.data)
	return data ? data : []
}
/**
 * @function getTotalDevices get all devices belonging to an Org
 */
export const getTotalDevices = async (orgUUID) => {
	var data = await servicesAPI.get(`/v2/total-devices/${orgUUID}`).then(rs => rs.data)
	return data ? data : "-"
}
/**
 * @function getOrg Get an organization based on ID
 * @param {uuid} orgId Organization ID
 */
export const getOrg = async (orgId) => {
	var data = await coreServicesAPI.get(`entity/organisation/${orgId}`).then(rs => rs.ok ? rs.data : null)
	return data
}


/**
 * @function getOrgUsers Get Organization's users
 * @param {UUID} orgUuid Organization ID
 */
export const getOrgUsers = async (orgUuid) => {
	// var data = await api.get(`core/org/users/${orgId}`).then(rs => rs.data)
	var result = await coreServicesAPI.get(`/entity/users/${orgUuid}`).then(rs => rs.ok ? rs.data : rs.ok)
	return result
}

/**
 * @function updateOrg Update an organization
 * @param {object} org
 */
export const updateOrg = async (org) => {
	// var data = async () => {
	// 	let r = await api.put(`core/org/${org.id}`, org).then(rs => rs.data)
	// 	await servicesAPI.put(`/v1/customer`, { name: org.name, ODEUM_org_id: org.id })
	// 	return r
	// }
	// return data()
	var result = await coreServicesAPI.put(`/entity/organisation/${org.uuid}`, org).then(rs => rs.ok ? rs.data : rs.ok)
	return result
}

/**
 * @function createOrg Create an organization
 * @param {object} org
 */
export const createOrg = async (org) => {
	// var result = await api.post('core/org', org).then(rs => rs.data)
	// var result2 = await servicesAPI.post('/v1/customer', { ...org, org_id: result.id }).then(rs => rs.ok)
	// if (result && result2)
	// 	return result
	// return result & result2
	var result = await coreServicesAPI.post(`/entity/organisation`, org).then(rs => rs.ok ? rs.data : rs.ok)
	return result
}

/**
 * @function deleteOrg Delete an Organization
 * @param {object} org
 */
export const deleteOrg = async (org) => {
	// var result = await api.delete(`core/org/${org}`).then(rs => rs)
	var result = await coreServicesAPI.delete(`entity/organisation/${org}`).then(rs => rs.ok)
	del('org.' + org)
	return result
}

//#region Senti Services

//#endregion
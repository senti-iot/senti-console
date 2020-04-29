import { coreServicesAPI } from 'variables/data'


const privilegeStringGenerator = (privileges) => {
	let str = ''
	privileges.forEach((f, i) => {
		if (i !== privileges.length - 1)
			str = str + f + '|'
		else {
			str = str + f
		}
	})
	return str
}
/**
 * For Lists
 * POST https://dev.services.senti.cloud/core/v2/acl/test/user.modify|user.read
 * body: [uuid, uuid, uuid]
 */
export const getListPrivileges = async (uuids, pList) => {
	let res = await coreServicesAPI.post(`/acl/test/${privilegeStringGenerator(pList)}`, uuids).then(rs => rs.ok ? rs.data : undefined)
	return res
}


/**
 * For individual Resource UUID
 * GET https://dev.services.senti.cloud/core/v2/acl/test/{uuid}/user.modify|user.read
 *
 */
export const getPrivilege = async (uuid, pList) => {
	let res = await coreServicesAPI.get(`/acl/test/${uuid}/${privilegeStringGenerator(pList)}`).then(rs => rs.ok ? rs.data : undefined)
	return res
}
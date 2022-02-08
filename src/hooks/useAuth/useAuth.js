// import { localization, initialLocState } from 'Redux/localization';
import { useSelector } from 'react-redux'


const AuthProvider = () => {
	//Hooks

	//Redux
	const resources = useSelector(s => s.auth.resources)
	// const user = useSelector(s => s.settings.user)
	const userPriv = useSelector(s => s.auth.userPrivilege)
	//State

	//Const

	//useCallbacks

	//useEffects

	//Handlers
	const hasAccessList = (uuids, perm) => {
		let access = false
		uuids.forEach(async uuid => {
			access = hasAccess(uuid, perm)
		})
		return access
	}
	const hasAccess = (uuid, perm) => {
		if (uuid) {
			if (resources[uuid]) {
				return resources[uuid][perm]
			}
			return false
		}
		else {
			if (userPriv[perm]) {
				return userPriv[perm]
			}
			return false
		}
	}
	return { hasAccessList, hasAccess }
	// return (
	// 	<AuthProv.Provider value={{ hasAccess, hasAccessList }}>
	// 		{children}
	// 	</AuthProv.Provider>

	// )
}

export default AuthProvider

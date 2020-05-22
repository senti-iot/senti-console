

import { useContext } from 'react'
import { AuthProv } from 'hooks/providers/AuthProvider'

const useAuth = () => {
	const t = useContext(AuthProv)
	return t
}

export default useAuth

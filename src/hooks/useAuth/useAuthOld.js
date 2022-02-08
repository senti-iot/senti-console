

import { useContext } from 'react'
import { AuthProv } from 'hooks/providers/AuthProvider'

const useAuth = () => {
	const t = AuthProv
	return t
}

export default useAuth

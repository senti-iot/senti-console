

import { useContext } from 'react'
import { SProvider } from 'hooks/providers/SnackbarProvider'

const useSnackbar = () => {
	const s = useContext(SProvider)
	return s
}

export default useSnackbar

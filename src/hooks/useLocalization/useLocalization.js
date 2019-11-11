

import { useContext } from 'react'
import { TProvider } from 'hooks/providers/LocalizationProvider'

const useLocalization = () => {
	const t = useContext(TProvider)
	console.log(t, useContext(TProvider))
	return t
}

export default useLocalization

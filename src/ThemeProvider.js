import React from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { useSelector } from 'hooks'
import { nLightTheme, nDarkTheme } from 'variables/themes'
import { getWL } from 'variables/storage'
let wl = getWL()
// console.log(wl)
// const tOptions = wl.theme
// const lightTheme = nLightTheme(wl)
// const darkTheme = nDarkTheme(wl)
export const ThemeProvider = (props) => {
	const sTheme = useSelector(s => s.settings.theme)

	return (
		<MuiThemeProvider theme={sTheme === 0 ? nLightTheme(wl) : nDarkTheme(wl)}>
			{props.children}
		</MuiThemeProvider>
	)
}

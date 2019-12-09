import React from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { useSelector } from 'hooks'
import { nLightTheme, nDarkTheme } from 'variables/themes'
import { getWL } from 'variables/storage'
let wl = getWL()
// console.log(wl)
// const tOptions = wl.theme
console.log(wl)
const lightTheme = nLightTheme(wl ? wl : undefined)
const darkTheme = nDarkTheme(wl ? wl : undefined)
export const ThemeProvider = (props) => {
	const sTheme = useSelector(s => s.settings.theme)

	return (
		<MuiThemeProvider theme={sTheme === 0 ? lightTheme : darkTheme}>
			{props.children}
		</MuiThemeProvider>
	)
}

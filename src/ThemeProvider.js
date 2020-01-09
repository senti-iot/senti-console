import React from 'react'
import { MuiThemeProvider } from '@material-ui/core'
import { useSelector } from 'hooks'
import { nLightTheme, nDarkTheme } from 'variables/themes'
import { getWL } from 'variables/storage'
import Helmet from 'react-helmet'
import sentiIco from 'assets/icons/senti.ico'

export const ThemeProvider = (props) => {
	const sTheme = useSelector(s => s.settings.theme)
	let wl = getWL()
	// console.log(wl)
	// const tOptions = wl.theme
	// console.log(wl)
	const lightTheme = nLightTheme(wl ? wl : undefined)
	const darkTheme = nDarkTheme(wl ? wl : undefined)
	return (
		<MuiThemeProvider theme={sTheme === 0 ? lightTheme : darkTheme}>
			<Helmet>
				{wl ? wl.pageTitle ? <title>{wl.pageTitle}</title> : "Senti" : "Senti"}
				<link rel="icon" type="image/png" href={wl ? wl.favicon ? wl.favicon : sentiIco : sentiIco} sizes="16x16" />
			</Helmet>
			{props.children}
		</MuiThemeProvider>
	)
}

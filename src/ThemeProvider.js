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
	const lightTheme = nLightTheme(wl ? wl : undefined)
	const darkTheme = nDarkTheme(wl ? wl : undefined)
	return (
		<MuiThemeProvider theme={sTheme === 0 ? lightTheme : darkTheme}>
			<Helmet>
				{wl ? wl.pageTitle ? <title>{wl.pageTitle}</title> : <title>Senti</title> : <title>Senti</title>}
				<link rel="icon" type="image/png" href={wl ? wl.favicon ? wl.favicon : sentiIco : sentiIco} sizes="16x16" />
				<link rel="shortcut icon" href={wl ? wl.favicon ? wl.favicon : sentiIco : sentiIco} />
			</Helmet>
			{props.children}
		</MuiThemeProvider>
	)
}

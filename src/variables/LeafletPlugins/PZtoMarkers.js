import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton, MuiThemeProvider } from '@material-ui/core';
import { Smartphone, DeviceHub } from 'variables/icons'
import teal from '@material-ui/core/colors/teal'

const styles = theme => ({
	locationMarker: {
		animation: `leaflet-control-locate-throb 4s ease infinite`
	},
	"@keyframes leaflet-control-locate-throb": {
		"0%": { r: 9, strokeWidth: 1 },
		"50%": { r: 7, strokeWidth: 3 },
		"100%": { r: 9, strokeWidth: 1 },
	},
	locRequesting: {
		animation: `loc-request 1000ms ${theme.transitions.easing.easeInOut} infinite`
	},
	"@keyframes loc-request": {
		'0%': {
			background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		},
		'50%': {
			background: teal[500],
		},
		'100%': {
			background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		},
	},
	locButton: {
		background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		color: theme.palette.type !== 'dark' ? 'inherit' : "#fff",
		[theme.breakpoints.up('sm')]: {
			"&:hover": {
				background: teal[500],
				color: "#fff"
			},
		},
		"&:hover": {
			background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
			color: theme.palette.type !== 'dark' ? 'inherit' : "#fff",
		},
		padding: 4,
		borderRadius: 4,
		margin: 4
	},
	locActiveButton: {
		background: teal[500],
		color: '#ffffff',
		"&:hover": {
			background: teal[400],
			color: "#fff"
		},
	},

	fullscreenOn: {
		width: '100%!important',
		height: '100%!important'
	},
	pseudoFullscreen: {
		position: "fixed!important",
		width: "100%!important",
		height: "100%!important",
		top: "0!important",
		left: "0!important",
		zIndex: 99999,
	}
})
export default withLeaflet(withStyles(styles, { withTheme: true })(class Fullscreen extends MapControl {

	constructor(props, context) {
		super(props)
		this.map = context.map || this.props.leaflet.map;
		this.container = L.DomUtil.create('div', 'leaflet-control-locate');
	}
	
	createLeafletElement(props) {
		const PZtoMarkers = Control.extend({
			options: {
				position: "topleft"
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<IconButton
							buttonRef={r => this.button = r}
							className={this.props.classes.locButton}
							onClick={this.onClick}
							color={'primary'}>
							{this.props.markers.length > 1 ? <DeviceHub /> : <Smartphone />}
						</IconButton>
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new PZtoMarkers(props)
	}

	onClick = () => {
		this.map.flyToBounds([...this.props.markers.map(m => m.lat && m.long ? [m.lat, m.long] : null)])
	}
	
}))
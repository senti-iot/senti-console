import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, MuiThemeProvider, Paper } from '@material-ui/core';

// import teal from '@material-ui/core/colors/teal'
import { ItemG } from 'components';

const styles = theme => ({
	fullscreenButton: {
		background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		color: theme.palette.type !== 'dark' ? 'inherit' : "#fff",
		// "&:hover": {
		// 	background: teal[500],
		// 	color: "#fff"
		// },
		padding: 4,
		borderRadius: 4,
	},
	fullscreenOn: {
		width: '100%!important',
		height: '100%!important'
	},
	gradientBar: {
		width: 250,
		height: 20,
		background: "rgb(255,255,255)",
		// eslint-disable-next-line no-dupe-keys
		background: "-moz-linear-gradient(left, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%, rgba(144, 202, 249, 1) 10%, rgba(66, 165, 245, 1) 20%, rgba(38, 166, 154, 1) 40%, rgba(253, 216, 53, 1) 60%, rgba(245, 124, 0, 1) 80%, rgba(211, 47, 47, 1) 100%)",
		// eslint-disable-next-line no-dupe-keys
		background: "-webkit - linear - gradient(left, rgba(255, 255, 255, 1) 0 %, rgba(255, 255, 255, 1) 0 %, rgba(144, 202, 249, 1) 10 %, rgba(66, 165, 245, 1) 20 %, rgba(38, 166, 154, 1) 40 %, rgba(253, 216, 53, 1) 60 %, rgba(245, 124, 0, 1) 80 %, rgba(211, 47, 47, 1) 100 %)",
		// eslint-disable-next-line no-dupe-keys
		background: "linear-gradient(to right, rgba(255,255,255,1) 0%,rgba(255,255,255,1) 0%,rgba(144,202,249,1) 10%,rgba(66,165,245,1) 20%,rgba(38,166,154,1) 40%,rgba(253,216,53,1) 60%,rgba(245,124,0,1) 80%,rgba(211,47,47,1) 100%)",
		filter: 'progid:DXImageTransform.Microsoft.gradient( startColorstr="#ffffff", endColorstr="#d32f2f",GradientType=1 )'
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
export default withLeaflet(withStyles(styles, { withTheme: true })(class HeatMapLegend extends MapControl {

	constructor(props, context) {
		super(props)
		this.map = context.map || this.props.leaflet.map;
		this.container = L.DomUtil.create('div', 'leaflet-control-heatbar leaflet-bar');
	}

	componentDidMount() {
		super.componentDidMount();
	}

	createLeafletElement(props) {
		const HeatMapLegend = Control.extend({
			options: {
				position: this.props.position || 'bottomleft',
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<Paper classes={{ root: this.props.classes.fullscreenButton }}>
							<div className={this.props.classes.gradientBar} /> 
							<ItemG container justify={'space-between'} alignItems={'space-between'}>
								<div style={{ width: 40 }}>0</div>
								<div style={{ width: 40 }}>25000</div>
								<div style={{ width: 40 }}>50000+</div>
							</ItemG>
						</Paper>
					
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new HeatMapLegend(props)
	}
}))
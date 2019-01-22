import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton, MuiThemeProvider } from '@material-ui/core';
import teal from '@material-ui/core/colors/teal'
import {  Add, Remove } from 'variables/icons';
import { ItemG } from 'components';

const styles = theme => ({
	fullscreenButton: {
		background: theme.palette.type !== 'dark' ? '#fff' : "#424242",
		color: theme.palette.type !== 'dark' ? 'inherit' : "#fff",
		"&:hover": {
			background: teal[500],
			color: "#fff"
		},
		padding: 4,
		borderRadius: 4,
		margin: 4
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
	},

})
export default withLeaflet(withStyles(styles, { withTheme: true })(class ZoomControl extends MapControl {

	constructor(props, context) {
		super(props)
		this.zoomContainer = L.DomUtil.create('div', 'leaflet-control-zoom');
		this.map = context.map || this.props.leaflet.map;
	}

	componentDidMount() {
		super.componentDidMount();
	}

	zoomIn = (e) => {
		e.stopPropagation();
		L.DomEvent.stopPropagation(e);
		L.DomEvent.disableClickPropagation(this.zoomInButton);
		this.map.zoomIn(this.map.options.zoomDelta * (e.shiftKey ? 3 : 1))
	}
	zoomOut = e => {
		e.stopPropagation();
		L.DomEvent.stopPropagation(e);
		L.DomEvent.disableClickPropagation(this.zoomOutButton);
		this.map.zoomOut(this.map.options.zoomDelta * (e.shiftKey ? 3 : 1))
	}
	createLeafletElement(props) {
		const ZoomControl = Control.extend({
			options: {
				position: this.props.position || 'topleft',
			},
			onAdd: () => {
				const jsx1 = (
					<MuiThemeProvider theme={this.props.theme}>
						<ItemG container direction={'column'}>
							<IconButton
								className={this.props.classes.fullscreenButton + " leaflet-bar"}
								onClick={this.zoomIn}
								buttonRef={r => this.zoomInButton = r}
								color={'primary'}>
								<Add />
							</IconButton>
							<IconButton
								className={this.props.classes.fullscreenButton + " leaflet-bar"}
								onClick={this.zoomOut}
								buttonRef={r => this.zoomOutButton = r}
								color={'primary'}>
								<Remove />
							</IconButton>
						</ItemG>
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx1, this.zoomContainer)
				return this.zoomContainer
			}
		})
		return new ZoomControl(props)
	}
}))
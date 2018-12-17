import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton, MuiThemeProvider } from '@material-ui/core';
import { FullscreenOutlined } from '@material-ui/icons';
import teal from '@material-ui/core/colors/teal'

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
		this.container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar');
		L.Map.include({
			isFullscreen: function () {
				return this._isFullscreen || false;
			},
			setFullscreen: function (fullscreen) {
				this._isFullscreen = fullscreen;
				var container = this.getContainer();
				if (fullscreen) {
					L.DomUtil.addClass(container, props.classes.fullscreenOn);
				} else {
					L.DomUtil.removeClass(container, props.classes.fullscreenOn);
				}
				this.invalidateSize();
				this.fire('fullscreenchange')
			},

			_onFullscreenChange: function (e) {
				var fullscreenElement =
					document.fullscreenElement ||
					document.mozFullScreenElement ||
					document.webkitFullscreenElement ||
					document.msFullscreenElement;

				if (fullscreenElement === this.getContainer() && !this._isFullscreen) {
					this.setFullscreen(true);
					this.fire('fullscreenchange');
				} else if (fullscreenElement !== this.getContainer() && this._isFullscreen) {
					this.setFullscreen(false);
					this.fire('fullscreenchange');
				}
			}
		})
		L.Map.addInitHook(function () {
			var fullscreenchange;

			if ('onfullscreenchange' in document) {
				fullscreenchange = 'fullscreenchange';
			} else if ('onmozfullscreenchange' in document) {
				fullscreenchange = 'mozfullscreenchange';
			} else if ('onwebkitfullscreenchange' in document) {
				fullscreenchange = 'webkitfullscreenchange';
			} else if ('onmsfullscreenchange' in document) {
				fullscreenchange = 'MSFullscreenChange';
			}
			if (fullscreenchange) {
				var onFullscreenChange = L.bind(this._onFullscreenChange, this);

				this.whenReady(function () {
					L.DomEvent.on(document, fullscreenchange, onFullscreenChange);
				});

				this.on('unload', function () {
					L.DomEvent.off(document, fullscreenchange, onFullscreenChange);
				});
			}
		})
	
	}

	componentDidMount() {
		super.componentDidMount();
	}
	toggleFullscreen = (options) => {
		var container = this.map.getContainer();
		if (this.map.isFullscreen()) {
			if (options && options.pseudoFullscreen) {
				this.disablePseudoFullscreen(container);
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else {
				this.disablePseudoFullscreen(container);
			}
		} else {
			if (options && options.pseudoFullscreen) {
				this.enablePseudoFullscreen(container);
			} else if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else {
				this.enablePseudoFullscreen(container);
			}
		}
		this.map.setFullscreen(!this.map.isFullscreen())
	}
	enablePseudoFullscreen = (container) => {
		L.DomUtil.addClass(container, this.props.classes.pseudoFullscreen);
	}

	disablePseudoFullscreen = (container) => {
		L.DomUtil.removeClass(container, this.props.classes.pseudoFullscreen);
	}

	createLeafletElement(props) {
		const Fullscreen = Control.extend({
			options: {
				position: this.props.position || 'topright',
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<IconButton
							className={this.props.classes.fullscreenButton}
							onClick={() => this.toggleFullscreen(this.map.options)}
							color={'primary'}>
							<FullscreenOutlined />
						</IconButton>
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new Fullscreen(props)
	}
}))
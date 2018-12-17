import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton } from '@material-ui/core';
import { FullscreenOutlined } from '@material-ui/icons';

const styles = theme => ({
	zoomButton: {
		background: 'red',
		width: 50,
		height: 50
	}
})
export default withLeaflet(withStyles(styles)(class Fullscreen extends MapControl {

	constructor(props, context) {
		super(props)
		this.container = L.DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar');
		// this.link = L.DomUtil.create('a', `leaflet-control-fullscreen-button leaflet-bar-part ${this.props.classes.zoomButton}`, container);
		
		// this.link.href = '#';
		L.Map.include({
			isFullscreen: function () {
				return this._isFullscreen || false;
			},
			setFullscreen: function (fullscreen) {
				this._isFullscreen = fullscreen;
				var container = this.getContainer();
				if (fullscreen) {
					L.DomUtil.addClass(container, 'leaflet-fullscreen-on');
				} else {
					L.DomUtil.removeClass(container, 'leaflet-fullscreen-on');
				}
				this.invalidateSize();
			},

			onFullscreenChange: function (e) {
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
		this.map = context.map || this.props.leaflet.map;
	
	}

	componentDidMount() {
		super.componentDidMount();
		// this.link.addEventListener('click', e => {
		// 	L.DomEvent.stopPropagation(e);
		// 	L.DomEvent.preventDefault(e);
		// 	this.toggleFullscreen(this.map.options)
		// 	// this.map.toggleFullscreen(this.map.options)
		// })
		console.log(this.map.isFullscreen())
		// this.changeZoomInfoAuto();
		// this.input.addEventListener('change', () => {
		// 	if (this.input.value !== '') {
		// 		if (this.input.value < 0) { this.input.value = 0; }
		// 		if (typeof this.map.options.minZoom !== 'undefined' && this.input.value < this.map.options.minZoom) {
		// 			this.map.setZoom(this.map.options.minZoom);
		// 			if ( this.map.getZoom() == this.map.options.minZoom) {
		// 				this.input.value = this.map.options.minZoom
		// 			}
		// 		}
		// 		if (typeof this.map.options.maxZoom !== 'undefined' && this.input.value > this.map.options.maxZoom) {
		// 			this.map.setZoom(this.map.options.maxZoom);
		// 			if ( this.map.getZoom() == this.map.options.maxZoom) {
		// 				this.input.value = this.map.options.maxZoom
		// 			}
		// 		} else {
		// 			this.map.setZoom(this.input.value);
		// 		}
		// 	}
		// })
	}
	toggleFullscreen = (options) => {
		var container = this.map.getContainer();
		if (this.map.isFullscreen()) {
			if (options && options.pseudoFullscreen) {
				this._disablePseudoFullscreen(container);
			} else if (document.exitFullscreen) {
				document.exitFullscreen();
			} else if (document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if (document.webkitCancelFullScreen) {
				document.webkitCancelFullScreen();
			} else if (document.msExitFullscreen) {
				document.msExitFullscreen();
			} else {
				this._disablePseudoFullscreen(container);
			}
		} else {
			if (options && options.pseudoFullscreen) {
				this._enablePseudoFullscreen(container);
			} else if (container.requestFullscreen) {
				container.requestFullscreen();
			} else if (container.mozRequestFullScreen) {
				container.mozRequestFullScreen();
			} else if (container.webkitRequestFullscreen) {
				container.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
			} else if (container.msRequestFullscreen) {
				container.msRequestFullscreen();
			} else {
				this._enablePseudoFullscreen(container);
			}
		}
		this.map.setFullscreen(!this.map.isFullscreen())
	}
	enablePseudoFullscreen = (container) => {
		L.DomUtil.addClass(container, 'leaflet-pseudo-fullscreen');
		this.map.setFullscreen(true);
		this.fire('fullscreenchange');
	}

	disablePseudoFullscreen = (container) => {
		L.DomUtil.removeClass(container, 'leaflet-pseudo-fullscreen');
		this.map.setFullscreen(false);
		this.fire('fullscreenchange');
	}

	createLeafletElement(props) {
		const Fullscreen = Control.extend({
			options: {
				position: this.props.position || 'topright',
				// title: {
				// 	'false': 'View Fullscreen',
				// 	'true': 'Exit Fullscreen'
				// }
			},
			onAdd: () => {
				const jsx = (
					<IconButton
						onClick={() => this.toggleFullscreen(this.map.options)}
						color={'primary'}
						style={{ padding: 4, background: '#fff', borderRadius: 4 }}>
						<FullscreenOutlined />
					</IconButton>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
				// this.link
			}
		})
		return new Fullscreen(props)
	}
}))
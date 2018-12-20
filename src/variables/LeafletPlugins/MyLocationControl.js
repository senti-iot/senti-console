import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton, MuiThemeProvider } from '@material-ui/core';
import { LocationOn } from 'variables/icons'
import teal from '@material-ui/core/colors/teal'
// import LocationMarker from './LocationMarker';

var LDomUtilApplyClassesMethod = function (method, element, classNames) {
	classNames = classNames.split(' ');
	classNames.forEach(function (className) {
		L.DomUtil[method].call(this, element, className);
	});
};

var addClasses = function (el, names) { LDomUtilApplyClassesMethod('addClass', el, names); };
var removeClasses = function (el, names) { LDomUtilApplyClassesMethod('removeClass', el, names); };

const styles = theme => ({
	locButton: {
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
		const MyLocationControl = Control.extend({
			options: {
				drawMarker: true,
				drawCircle: true,
				position: this.props.position || 'topleft',
				layer: undefined,
				setView: 'untilPanOrZoom',
				keepCurrentZoomLevel: false,
				flyTo: false,
				clickBehaviour: {
					inView: 'stop',
					outOfView: 'setView',
					inViewNotFollowing: 'inView'
				},
				returnToPrevBounds: false,
				locateOptions: {
					maxZoom: Infinity,
					watch: true,  // if you overwrite this, visualization cannot be updated
					setView: false // have to set this to false because we have to do setView manually
				},
				circleStyle: {
					className: 'leaflet-control-locate-circle',
					color: '#136AEC',
					fillColor: '#136AEC',
					fillOpacity: 0.15,
					weight: 0
				},
				markerStyle: {
					className: 'leaflet-control-locate-marker',
					color: '#fff',
					fillColor: '#2A93EE',
					fillOpacity: 1,
					weight: 3,
					opacity: 1,
					radius: 9
				},
				/** Compass */
				compassStyle: {
					fillColor: '#2A93EE',
					fillOpacity: 1,
					weight: 0,
					color: '#fff',
					opacity: 1,
					radius: 9, // How far is the arrow is from the center of of the marker
					width: 9, // Width of the arrow
					depth: 6  // Length of the arrow
				}
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<IconButton
							buttonRef={r => this.button = r}
							className={this.props.classes.fullscreenButton}
							onClick={this.onClick}
							color={'primary'}>
							<LocationOn />
						</IconButton>
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new MyLocationControl(props)
	}
	isFollowing = () => {
		let le = this.leafletElement
		if (!le._active) {
			return false;
		}

		if (le.options.setView === 'always') {
			return true;
		} else if (le.options.setView === 'untilPan') {
			return !le._userPanned;
		} else if (le.options.setView === 'untilPanOrZoom') {
			return !le._userPanned && !le._userZoomed;
		}
	}
	onClick = () => {
		let le = this.leafletElement
		this.leafletElement._justClicked = true;
		var wasFollowing = this.isFollowing();
		this.leafletElement._userPanned = false;
		this.leafletElement._userZoomed = false;

		if (le._active && !le._event) {
		// click while requesting
			this.stop();
		} else if (le._active && le._event !== undefined) {
			var behaviors = le.options.clickBehavior;
			var behavior = behaviors.outOfView;
			if (this.map.getBounds().contains(le._event.latlng)) {
				behavior = wasFollowing ? behaviors.inView : behaviors.inViewNotFollowing;
			}

			// Allow inheriting from another behavior
			if (behaviors[behavior]) {
				behavior = behaviors[behavior];
			}

			switch (behavior) {
				case 'setView':
					this.setView();
					break;
				case 'stop':
					this.stop();
					if (le.options.returnToPrevBounds) {
						var f = le.options.flyTo ? this.map.flyToBounds : this.map.fitBounds;
						f.bind(this.map)(le.prevBounds);
					}
					break;
				default:
					break;
			}
		} else {
			if (le.options.returnToPrevBounds) {
				this.leafletElement.prevBounds = this.map.getBounds();
			}
			this.start();
		}

		this.updateContainerStyle();
	}
	getLocationBounds = (locationEvent) => {
		return locationEvent.bounds
	}
	start = () => {
	    this.activate()
		if (this.leafletElement._event) {
			this.drawMarker(this.map)
		}
		// if (this.leafletElement.options.setView) {
		// 	this.setView()
		// }
		this.updateContainerStyle()
	}
	activate = () => {
		if (!this.leafletElement.active) {
			this.activateEvents()
			this.map.locate(this.leafletElement.options.locateOptions)
			this.leafletElement.active = true
			//Events
		}
	}
	activateEvents = () => {
		this.map.on('locationfound', this.onLocationFound, this.map)
		this.map.on('locationerror', this.onLocationError, this.map);
		this.map.on('dragstart', this.onDrag, this.map);
		this.map.on('zoomstart', this.onZoom, this.map);
		this.map.on('zoomend', this.onZoomEnd, this.map);
	}
	onLocationFound = (e) => {
		let ev = this.leafletElement._event
		if (ev &&
			ev.latlng.lat === e.latlng.lat &&
			ev.latlng.lng === e.latlng.lng &&
			ev.accuracy === e.accuracy) {
			return;
		}
		if (!this.leafletElement.active) {
			return;
		}
		this.leafletElement._event = e
		console.log(this.leafletElement._event, e)
		this.drawMarker()
		this.updateContainerStyle()

		switch (this.leafletElement.options) {
			case 'once':
				if (this.leafletElement._justClicked) {
					this.setView();
				}
				break;
			case 'untilPan':
				if (!this.leafletElement._userPanned) {
					this.setView();
				}
				break;
			case 'untilPanOrZoom':
				if (!this.leafletElement._userPanned && !this.leafletElement._userZoomed) {
					this.setView();
				}
				break;
			case 'always':
				this.setView();
				break;
			case false:
				// don't set the view
				break;
			default:
				break;
		}
		this.leafletElement._justClicked = false
	}
	onLocationError = () => {
		alert('Location error')
	}
	onDrag = () => {

	}
	onZoom = () => {

	}
	onZoomEnd = () => {

	}
	LocationMarker = L.Marker.extend({
		initialize: function (latlng, options) {
			L.Util.setOptions(this, options);
			this._latlng = latlng;
			this.createIcon();
		},

		/**
			 * Create a styled circle location marker
			 */
		createIcon: function () {
			var opt = this.options;

			var style = '';

			if (opt.color !== undefined) {
				style += 'stroke:' + opt.color + ';';
			}
			if (opt.weight !== undefined) {
				style += 'stroke-width:' + opt.weight + ';';
			}
			if (opt.fillColor !== undefined) {
				style += 'fill:' + opt.fillColor + ';';
			}
			if (opt.fillOpacity !== undefined) {
				style += 'fill-opacity:' + opt.fillOpacity + ';';
			}
			if (opt.opacity !== undefined) {
				style += 'opacity:' + opt.opacity + ';';
			}

			var icon = this._getIconSVG(opt, style);

			this._locationIcon = L.divIcon({
				className: icon.className,
				html: icon.svg,
				iconSize: [icon.w, icon.h],
			});

			this.setIcon(this._locationIcon);
		},

		/**
			 * Return the raw svg for the shape
			 *
			 * Split so can be easily overridden
			 */
		_getIconSVG: function (options, style) {
			var r = options.radius;
			var w = options.weight;
			var s = r + w;
			var s2 = s * 2;
			var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s2 + '" height="' + s2 + '" version="1.1" viewBox="-' + s + ' -' + s + ' ' + s2 + ' ' + s2 + '">' +
				'<circle r="' + r + '" style="' + style + '" />' +
				'</svg>';
			return {
				className: 'leafet-control-locate-location',
				svg: svg,
				w: s2,
				h: s2
			};
		},

		setStyle: function (style) {
			L.Util.setOptions(this, style);
			this.createIcon();
		}
	})
	drawMarker = () => {
		let ev = this.leafletElement._event
		console.log('drawMarker', this.leafletElement)
		let options = this.leafletElement.options
		let le = this.leafletElement
		if (ev.accuracy === undefined) {
			ev.accuracy = 0
		}
		var radius = ev.accuracy
		var latlng = ev.latlng
		if (options.drawCircle) {
			var style = options.circleStyle
			if (!le._circle) {
				this.leafletElement._circle = L.circle(latlng, radius, style).addTo(this.map)
				console.log('circle', this.leafletElement._circle)
			}
			else {
				this.leafletElement._circle.setLatLng(latlng).setRadius(radius).setStyle(style)
			}
		}

		// var distance, unit;
		// if (options.metric) {
		// 	distance = radius.toFixed(0)
		// 	unit = options.strings.metersUnit
		// }
		// else { 
		// 	distance = (radius * 3.2808399).toFixed(0);
		// 	unit = options.strings.feetUnit;
		// }
		window.map = this.map
		if (options.drawMarker) {
			var mStyle = options.markerStyle
			if (!le._marker) {
				this.leafletElement._marker = new this.LocationMarker(latlng, mStyle).addTo(this.map)
			}
			else {
				this.leafletElement._marker.setLatLng(latlng)
				if (this.leafletElement._marker.setStyle) {
					this.leafletElement._marker.setStyle(mStyle)
				}
			}
		}

	}
	isFollowing = () => {
		let le = this.leafletElement
		if (!le._active) {
			return false;
		}

		if (le.options.setView === 'always') {
			return true;
		} else if (le.options.setView === 'untilPan') {
			return !le._userPanned;
		} else if (le.options.setView === 'untilPanOrZoom') {
			return !le._userPanned && !le._userZoomed;
		}
	}
	updateContainerStyle = () => {
		let le = this.leafletElement
		if (!this.container) {
			return;
		}

		if (le._active && !le._event) {
			// active but don't have a location yet
			this.setClasses('requesting');
		} else if (this.isFollowing()) {
			this.setClasses('following');
		} else if (le._active) {
			this.setClasses('active');
		} else {
			// this.cleanClasses();s
		}
	}
	setClasses = (state) => {

		if (state === 'requesting') {
			removeClasses(this.container, "active following");
			addClasses(this.container, "requesting");

			removeClasses(this.button, this.options.icon);
			addClasses(this.button, this.options.iconLoading);
		} else if (state === 'active') {
			removeClasses(this.container, "requesting following");
			addClasses(this.container, "active");

			removeClasses(this.button, this.options.iconLoading);
			addClasses(this.button, this.options.icon);
		} else if (state === 'following') {
			removeClasses(this.container, "requesting");
			addClasses(this.container, "active following");

			removeClasses(this.button, this.options.iconLoading);
			addClasses(this.button, this.options.icon);
		}
	}
	setView = () => {
		let le = this.leafletElement
		this.drawMarker();
		if (le._isOutsideMapBounds()) {
			le._event = undefined;  // clear the current location so we can get back into the bounds
			le.options.onLocationOutsideMapBounds(this);
		} else {
			if (le.options.keepCurrentZoomLevel) {
				var f = le.options.flyTo ? this.map.flyTo : this.map.panTo;
				f.bind(this.map)([le._event.latitude, le._event.longitude]);
			} else {
				var df = le.options.flyTo ? this.map.flyToBounds : this.map.fitBounds;
				// Ignore zoom events while setting the viewport as these would stop following
				le._ignoreEvent = true;
				df.bind(this._map)(le.options.getLocationBounds(le._event), {
					padding: le.options.circlePadding,
					maxZoom: le.options.locateOptions.maxZoom
				});
				L.Util.requestAnimFrame(function () {
					// Wait until after the next animFrame because the flyTo can be async
					le._ignoreEvent = false;
				}, this.leafletElement);

			}
		}
	}
}))
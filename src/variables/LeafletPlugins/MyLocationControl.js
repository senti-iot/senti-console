import React from 'react'
import ReactDOM from 'react-dom'
import L, { Control } from 'leaflet'
import { MapControl, withLeaflet } from 'react-leaflet'
import { withStyles, IconButton, MuiThemeProvider } from '@material-ui/core';
import teal from '@material-ui/core/colors/teal'
import { MyLocation } from 'variables/icons';

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
	setClasses = (state) => {
		if (state === 'requesting') {

			this.addClasses(this.button, this.props.classes.locRequesting)

		
		} else if (state === 'active') {
			this.removeClasses(this.button, this.props.classes.locRequesting)
			this.addClasses(this.button, this.props.classes.locActiveButton)
		} else if (state === 'following') {

		}
	}
	createLeafletElement(props) {
		const MyLocationControl = Control.extend({
			options: {
				drawMarker: true,
				drawCircle: true,
				position: this.props.position || 'topleft',
				layer: undefined,
				setView: 'untilPan',
				keepCurrentZoomLevel: false,
				flyTo: true,
				cacheLocation: false,
				clickBehaviour: {
					inView: 'stop',
					outOfView: 'setView',
					inViewNotFollowing: 'inView'
				},
				metric: true,
				returnToPrevBounds: false,
				locateOptions: {
					maxZoom: Infinity,
					watch: true,
					setView: false
				},
				circleStyle: {
					className: 'leaflet-control-locate-circle',
					color: '#136AEC',
					fillColor: teal[500],
					fillOpacity: 0.15,
					weight: 0
				},
				markerStyle: {
					color: '#fff',
					fillColor: teal[500],
					fillOpacity: 1,
					weight: 3,
					opacity: 1,
					radius: 9
				}
			},
			onAdd: () => {
				const jsx = (
					<MuiThemeProvider theme={this.props.theme}>
						<IconButton
							buttonRef={r => this.button = r}
							className={this.props.classes.locButton + " leaflet-touch leaflet-bar" }
							onClick={this.onClick}
							color={'primary'}>
							<MyLocation />
						</IconButton>
					</MuiThemeProvider>
				)
				ReactDOM.render(jsx, this.container)
				return this.container
			}
		})
		return new MyLocationControl(props)
	}
	onLocationOutsideMapBounds = (control) => {
		control.stop();
		alert(control.options.strings.outsideMapBoundsMsg);
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
			return !le._userPanned || !le._userZoomed;
		}
	}
	stop = () => {
		this.deactivate();
		this.cleanClasses();
		this.resetVariables();
		this.removeMarker();
	}
	deactivate = () => {
		this.map.stopLocate()
		this.leafletElement.active = false
		if (!this.leafletElement.options.cacheLocation) {
			this.leafletElement._event = undefined;
		}
		this.map.off('locationfound', this.onLocationFound, this.leafletElement)
		this.map.off('locationerror', this.onLocationError, this.leafletElement)
		this.map.off('dragstart', this.onDrag, this.leafletElement)
		this.map.off('zoomstart', this.onZoom, this.leafletElement)
		this.map.off('zoomend', this.onZoomEnd, this.leafletElement)
	}
	cleanClasses = () => {
		L.DomUtil.removeClass(this.button, this.props.classes.locActiveButton)
		L.DomUtil.removeClass(this.button, this.props.classes.locRequesting)
	}
	resetVariables = () => {
		this.leafletElement.active = false
		this.leafletElement._justClicked = false
		this.leafletElement._userPanned = false
		this.leafletElement._userZoomed = false
	}
	removeMarker = () => {
		this.map.removeLayer(this.leafletElement._circle)
		this.map.removeLayer(this.leafletElement._marker)
		this.leafletElement._circle = undefined
		this.leafletElement._marker = undefined
	}
	onClick = () => {
		let le = this.leafletElement
		this.leafletElement._justClicked = true;
		var wasFollowing = this.isFollowing();
		this.leafletElement._userPanned = false;
		this.leafletElement._userZoomed = false;

		if (le.active && !le._event) {
			this.stop();
		} else {
			if (le.active && le._event !== undefined) {
				var behaviors = le.options.clickBehaviour;
				var behavior = behaviors.outOfView;
				if (this.map.getBounds().contains(le._event.latlng)) {
					behavior = wasFollowing ? behaviors.inView : behaviors.inViewNotFollowing;
				}

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

		this.drawMarker()
		this.updateContainerStyle()

		switch (this.leafletElement.options.setView) {
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
		if (this.leafletElement._event && !this.leafletElement._ignoreEvent) {
			this.leafletElement._userZoomed = true;
			this.updateContainerStyle();
			this.drawMarker();
		}
	}
	onZoom = () => {
		if (this.leafletElement._event && !this.leafletElement._ignoreEvent) {
			this.leafletElement._userZoomed = true;
			this.updateContainerStyle();
			this.drawMarker();
		}
	}
	onZoomEnd = () => {

		if (this.leafletElement._event && !this.leafletElement._ignoreEvent) {
			if (!this.map.getBounds().pad(-.3).contains(this.leafletElement._marker.getLatLng())) {
				this.leafletElement._userPanned = true;
				this.updateContainerStyle();
				this.drawMarker();
			}
		}
	}
	_this = this
	LocationMarker = L.Marker.extend({
		initialize: function (latlng, options) {
			L.Util.setOptions(this, options);
			this._latlng = latlng;
			this.createIcon(options.className);
		},

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

			var icon = this._getIconSVG(opt, style, opt.className);

			this._locationIcon = L.divIcon({
				className: opt.className,
				html: icon.svg,
				iconSize: [icon.w, icon.h],
			});

			this.setIcon(this._locationIcon);
		},

		_getIconSVG: function (options, style, className) {
			var r = options.radius;
			var w = options.weight;
			var s = r + w;
			var s2 = s * 2;
			var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + s2 + '" height="' + s2 + '" version="1.1" viewBox="-' + s + ' -' + s + ' ' + s2 + ' ' + s2 + '">' +
				'<circle r="' + r + '" style="' + style + '" class="' + className + '" />' +
				'</svg>';
			return {
				className: className,
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
			}
			else {
				this.leafletElement._circle.setLatLng(latlng).setRadius(radius).setStyle(style)
			}
		}
		if (options.drawMarker) {
			var mStyle = options.markerStyle
			if (!le._marker) {
				this.leafletElement._marker = new this.LocationMarker(latlng, { ...mStyle, className: this.props.classes.locationMarker }).addTo(this.map)
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
		if (le.active && !le._event) {
			this.setClasses('requesting');
		} else if (this.isFollowing()) {
			this.setClasses('following');
		} else if (le.active) {
			this.setClasses('active');
		} else {
		}
	}

	LDomUtilApplyClassesMethod = (method, element, classNames) => {
		classNames = classNames.split(' ');
		classNames.forEach((className) => {
			L.DomUtil[method].call(this.leafletElement, element, className);
		});
	};

	addClasses = (el, names) => { this.LDomUtilApplyClassesMethod('addClass', el, names); };
	removeClasses = (el, names) => { this.LDomUtilApplyClassesMethod('removeClass', el, names); };


	isOutsideMapBounds = () => {
		if (this._event === undefined) {
			return false;
		}
		return this.map.options.maxBounds &&
			!this.map.options.maxBounds.contains(this.leafletElement._event.latlng);
	}
	setView = () => {
		let le = this.leafletElement
		this.drawMarker();
		if (this.isOutsideMapBounds()) {
			this.leafletElement._event = undefined; 
			this.onLocationOutsideMapBounds(this.leafletElement);
		} else {
			if (le.options.keepCurrentZoomLevel) {
				var f = le.options.flyTo ? this.map.flyTo : this.map.panTo;
				f.bind(this.map)([le._event.latitude, le._event.longitude]);
			} else {
				var df = le.options.flyTo ? this.map.flyToBounds : this.map.fitBounds;
				le._ignoreEvent = true;
				df.bind(this.map)(this.getLocationBounds(le._event), {
					padding: le.options.circlePadding,
					maxZoom: le.options.locateOptions.maxZoom
				});
				L.Util.requestAnimFrame(function () {
					le._ignoreEvent = false;
				}, this.leafletElement);

			}
		}
	}
}))

import L from 'leaflet'
import { MapLayer, withLeaflet } from 'react-leaflet'
import HeatmapJS from 'heatmap.js'
import { blue, teal, yellow, red, orange } from '@material-ui/core/colors';



export default withLeaflet(class HeatLayer extends MapLayer {
	constructor(props, context) {
		super(props)
		this.map = context.map || props.leaflet.map
		this._el = L.DomUtil.create('div', 'leaflet-zoom-hide')
		var size = this.map.getSize();
		this._width = size.x;
		this._height = size.y;

		this._el.style.width = size.x + 'px';
		this._el.style.height = size.y + 'px';
		// this._el.style.opacity = 1;
		// this._el.style.backgroundColor = "red"
		this._el.style.position = 'absolute';

	}
	max = 50000
	min = 0
	defaultConfig = {
		fixedRadius: true,
		// radiusMeters: true,
		radiusMeters: 50,
		latField: "lat",
		lngField: "lng",
		valueField: "count",
		container: this._el,
		radius: 10,
		maxOpacity: .8,
		minOpacity: 0,
		blur: .2,
		gradient: {
			// enter n keys between 0 and 1 here
			// for gradient color customization
			'0': 'white',
			'.1': blue[200],
			'.2': blue[400],
			'.4': teal[400],
			'.6': yellow[600],
			'.8': orange[500],
			'1.0': red[700]
		}
	}
	createLeafletElement() {
		const Heatmap = L.Layer.extend({
			initialize: function (config) {
				//CFG  = this.props
				// this.cfg = _this.defaultConfig;
				// this._data = [];
				// this._max = 1;
				// this._min = 0;
			},
			onAdd: () => {
				this.map.getPanes().overlayPane.appendChild(this._el)
				this.defaultConfig.container = this._el
				this.heatmap = HeatmapJS.create(this.defaultConfig)
				if (this.heatmap) {
					this.setData(this.props.data)
					this.map.on('moveend', this.reset, this.map)
				}
			},
			addTo: (map) => {
				map.addLayer(this)
				return this
			},
			onRemove: (map) => {
				map.getPanes().overlayPane.removeChild(this._el)
			},

		})
		return new Heatmap()
	}
	componentDidUpdate = () => { 
		this.setData(this.props.data)
	}
	componentDidMount = () => {
		// const Heatmap = L.Layer.extend({
		// 	initialize: function (config) {
		// 		//CFG  = this.props
		// 		// this.cfg = _this.defaultConfig;
		// 		// this._data = [];
		// 		// this._max = 1;
		// 		// this._min = 0;
		// 	},
		// 	onAdd: () => {
		// 		this.map.getPanes().overlayPane.appendChild(this._el)
		// 		this.defaultConfig.container = this._el
		// 		this.heatmap = HeatmapJS.create(this.defaultConfig)
		// 		if (this.heatmap) {
		// 			this.setData(this.props.data)
		// 			this.map.on('moveend', this.reset, this.map)
		// 		}
		// 	},
		// 	addTo: (map) => {
		// 		map.addLayer(this)
		// 		return this
		// 	},
		// 	onRemove: (map) => {
		// 		map.getPanes().overlayPane.removeChild(this._el)
		// 	},

		// })
		// this.leafletElement = new Heatmap();
		this.leafletElement._origin = this.map.layerPointToLatLng(new L.Point(0, 0));
		super.componentDidMount();

	}
	setData = (data) => {
		var latField = this.defaultConfig.latField || 'lat';
		var lngField = this.defaultConfig.lngField || 'lng';
		var valueField = this.defaultConfig.valueField || 'count';

		var len = data.length;
		var d = [];

		while (len--) {
			var entry = data[len];
			var latlng = new L.LatLng(entry[latField], entry[lngField]);
			var dataObj = { latlng: latlng };
			dataObj[valueField] = entry[valueField];
			if (entry.radius) {
				dataObj.radius = entry.radius;
			}
			d.push(dataObj);
		}
		this.data = d;
		this.draw();
	}
	draw = () => {
		if (!this.map) { return; }
		var mapPane = this.map.getPanes().mapPane;
		var point = mapPane._leaflet_pos;

		// reposition the layer
		this._el.style[this.CSS_TRANSFORM] = 'translate(' +
			-Math.round(point.x) + 'px,' +
			-Math.round(point.y) + 'px)';
		this.update();
	}

	update = () => {
		var bounds /* zoom */ /* scale */
		var generatedData = { max: this.max, min: this.min, data: [] };

		bounds = this.map.getBounds();
		// zoom = this.map.getZoom();
		// crs = this.map.options.crs
		// scale = crs.scale(zoom);7

		// scale = Math.pow(2, zoom);
		// var radiusMultiplier = this.defaultConfig.scaleRadius ? scale : 1;

		//If there is no data do not render anything on the heatmap
		if (this.props.data.length === 0) {
			if (this.heatmap) {
				this.heatmap.setData(generatedData);
			}
			return;
		}


		var latLngPoints = [];
		// var radiusMultiplier = this.defaultConfig.scaleRadius ? scale : 1;
		var localMax = 0;
		var localMin = 0;
		var valueField = this.defaultConfig.valueField;
		var len = this.data.length;

		while (len--) {
			var entry = this.data[len];
			var value = entry[valueField];
			var latlng = entry.latlng;


			// we don't wanna render points that are not even on the map ;-)
			if (!bounds.contains(latlng)) {
				continue;
			}
			// local max is the maximum within current bounds
			localMax = Math.max(value, localMax);
			localMin = Math.min(value, localMin);

			var point = this.map.latLngToContainerPoint(latlng);
			var latlngPoint = { x: Math.round(point.x), y: Math.round(point.y) };
			latlngPoint[valueField] = value;

			var radius;
			radius = this.getPixelRadius();
			// if (this.defaultConfig.fixedRadius && this.defaultConfig.radiusMeters) {
			// } 
			// if (entry.radius) {
			// 	radius = entry.radius * radiusMultiplier;
			// } else {
			// 	radius = (this.defaultConfig.radius || 2) * radiusMultiplier;

			// }
			latlngPoint.radius = radius;
			latLngPoints.push(latlngPoint);
		}
		if (this.defaultConfig.useLocalExtrema) {
			generatedData.max = localMax;
			generatedData.min = localMin;
		}

		generatedData.data = latLngPoints;

		this.heatmap.setData(generatedData);
	}
	getPixelRadius = () => {

		var centerLatLng = this.map.getCenter();
		var pointC = this.map.latLngToContainerPoint(centerLatLng);
		var pointX = [pointC.x + 1, pointC.y];

		// convert containerpoints to latlng's
		var latLngC = this.map.containerPointToLatLng(pointC);
		var latLngX = this.map.containerPointToLatLng(pointX);

		// Assuming distance only depends on latitude
		var distanceX = latLngC.distanceTo(latLngX);
		// 100 meters is the fixed distance here
		var pixels = this.defaultConfig.radiusMeters / distanceX;
		return pixels >= 1 ? pixels : 1;
	}
	reset = () => {
		this.leafletElement._origin = this.map.layerPointToLatLng(new L.Point(0, 0));

		var size = this.map.getSize();
		if (this.leafletElement._width !== size.x || this.leafletElement._height !== size.y) {
			this.leafletElement._width = size.x;
			this.leafletElement._height = size.y;

			this._el.style.width = this.leafletElement._width + 'px';
			this._el.style.height = this.leafletElement._height + 'px';
			this.heatmap._renderer.setDimensions(this.leafletElement._width, this.leafletElement._height);
		}
		this.draw();
	}
	CSS_TRANSFORM = (function () {
		var div = document.createElement('div');
		var props = [
			'transform',
			'WebkitTransform',
			'MozTransform',
			'OTransform',
			'msTransform'
		];

		for (var i = 0; i < props.length; i++) {
			var prop = props[i];
			if (div.style[prop] !== undefined) {
				return prop;
			}
		}
		return props[0];
	})();
	render() {
		return null
	}
})


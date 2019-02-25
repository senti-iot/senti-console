
import L from 'leaflet'
import { MapLayer, withLeaflet } from 'react-leaflet'
import HeatmapJS from 'heatmap.js'
import { blue, teal, yellow, red, orange } from '@material-ui/core/colors';
import { connect } from 'react-redux'
import moment from 'moment'

class HeatLayer extends MapLayer {
	constructor(props, context) {
		super(props)
		this.map = context.map || props.leaflet.map
		this._el = L.DomUtil.create('div', 'leaflet-zoom-hide')
		var size = this.map.getSize();
		this._width = size.x;
		this._height = size.y;

		this._el.style.width = size.x + 'px';
		this._el.style.height = size.y + 'px';
		this._el.style.position = 'absolute';

	}
	defaultValue = 25
	max = 50000
	min = 0
	defaultConfig = {
		fixedRadius: true,
		radiusMeters: 50,
		latField: "lat",
		lngField: "lng",
		valueField: "count",
		container: this._el,
		radius: 10,
		maxOpacity: .5,
		minOpacity: .3,
		blur: 0,
		gradient: {
			'0': blue[200],
			'.1': blue[300],
			'.2': blue[400],
			'.4': teal[400],
			'.6': yellow[600],
			'.8': orange[500],
			'1.0': red[700]
		}
	}
	setMaxValues = () => {
		const { from, to, timeType } = this.props
		let diff = -1
		switch (timeType) {
			case 0:
				this.max = this.defaultValue
				break
			case 1:
				diff = moment(to).diff(from, 'hours')
				if (diff >= 1) {
					this.max = this.defaultValue * 60 * diff
				}
				else {
					this.max = this.defaultValue * 60
				}
				break
			case 2:
			case 3:
				diff = moment(to).diff(from, 'days')
				if (diff >= 1)
					this.max = this.defaultValue * 1440 * diff
				else {
					this.max = this.defaultValue * 1440
				}
				break
			default:
				break
		}
	}
	createLeafletElement() {
		const Heatmap = L.Layer.extend({
			initialize: function (config) {
			},
			onAdd: () => {
				this.map.getPanes().overlayPane.appendChild(this._el)
				this.defaultConfig.container = this._el
				this.setMaxValues()
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
		this.setData(this.props.data ? this.props.data : [])
	}
	componentDidMount = () => {
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

		this._el.style[this.CSS_TRANSFORM] = 'translate(' +
			-Math.round(point.x) + 'px,' +
			-Math.round(point.y) + 'px)';
		this.update();
	}

	update = () => {
		var bounds /* zoom */ /* scale */
		this.setMaxValues()
		var generatedData = { max: this.max, min: this.min, data: [] };

		bounds = this.map.getBounds();
		if (this.props.data.length === 0) {
			if (this.heatmap) {
				this.heatmap.setData(generatedData);
			}
			return;
		}


		var latLngPoints = [];
		var localMax = 0;
		var localMin = 0;
		var valueField = this.defaultConfig.valueField;
		var len = this.data.length;

		while (len--) {
			var entry = this.data[len];
			var value = entry[valueField];
			var latlng = entry.latlng;


			if (!bounds.contains(latlng)) {
				continue;
			}
			localMax = Math.max(value, localMax);
			localMin = Math.min(value, localMin);

			var point = this.map.latLngToContainerPoint(latlng);
			var latlngPoint = { x: Math.round(point.x), y: Math.round(point.y) };
			latlngPoint[valueField] = value;

			var radius;
			radius = this.getPixelRadius();
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

		var latLngC = this.map.containerPointToLatLng(pointC);
		var latLngX = this.map.containerPointToLatLng(pointX);

		var distanceX = latLngC.distanceTo(latLngX);
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
}

const mapStateToProps = (state) => {
	return ({
		to: state.dateTime.heatMap.to,
		from: state.dateTime.heatMap.from,
		timeType: state.dateTime.heatMap.timeType
	})
}

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(withLeaflet(HeatLayer))
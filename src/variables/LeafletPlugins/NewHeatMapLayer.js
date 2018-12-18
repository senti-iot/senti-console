
import L from 'leaflet'
import { MapLayer, withLeaflet } from 'react-leaflet'
import HeatmapJS from 'heatmap.js'


export default withLeaflet(class NewHeatMapLayer extends MapLayer {
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

		this._origin = this.map.layerPointToLatLng(new L.Point(0, 0));
	}

	defaultConfig = {
	 	container: this._el,
	 	radius: 10,
	 	maxOpacity: .5,
	 	minOpacity: 0,
	 	blur: .75,
	 	gradient: {
	 		// enter n keys between 0 and 1 here
	 		// for gradient color customization
	 		'.5': 'blue',
	 		'.8': 'red',
	 		'.95': 'white'
	 	}
	 }
	 createLeafletElement() { 
	 	return null
	 }
	componentDidMount = () => {
		let _this = this
		const Heatmap = L.Layer.extend({
			initialize: function (config) {
				//CFG  = this.props
				this.cfg = _this.defaultConfig;
				this._data = [];
				this._max = 1;
				this._min = 0;
			},
			onAdd: (map) => {
				map.getPanes().overlayPane.appendChild(this._el)
				console.log(this._el)
				this.defaultConfig.container = this._el
				this._heatmap = HeatmapJS.create(this.config)
			},
			addTo: (map) => {
				map.addLayer(this)
				return this
			},
			onRemove: (map) => {
				map.getPanes().overlayPane.removeChild(this._el)
			}
		})
		this.leafletElement = new Heatmap();
		super.componentDidMount();


	}

	render() {
		return null
	}
})

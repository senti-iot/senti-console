import React, { Fragment } from 'react';
import {
	withLeaflet, Map, Popup, TileLayer, Marker
} from 'react-leaflet'
// import 'leaflet/dist/leaflet.css'
import L from 'leaflet';
import { withStyles } from '@material-ui/core';
import { connect } from 'react-redux'
import MarkerIcon from './MarkerIcon';
import mapStyles from './mapStyles'
import OpenPopup from './OpenPopup'
// import LeafletM from './LeafletM';

/**
 * Plugins
 */
import FullScreen from 'variables/LeafletPlugins/FullScreen'
import ZoomControl from 'variables/LeafletPlugins/ZoomControl';
import HeatLayer from 'variables/LeafletPlugins/HeatLayer';
import HeatMapLegend from 'variables/LeafletPlugins/HeatMapLegend';


class OpenStreetMap extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			zoom: props.markers.length === 1 ? 17 : 13
		}
	}
	//Request URL: 17/69319/89866.png

	layers = [
		{
			id: 0, url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png",
			attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 20
		},
		{
			id: 1,
			url: "https://gc2.io/mapcache/baselayers/tms/1.0.0/luftfotoserier.geodanmark_2017_12_5cm/{z}/{x}/{-y}.png",
			attribution: 'Map Tiles by <a target="_blank" href="http://www.mapcentia.com/">MapCentia</a>',
			maxZoom: 18
		},
		{
			id: 2,
			url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
			attribution: 'Map Tiles by <a target="_blank" href="https://carto.com/attribution/">CARTO</a>',
			maxZoom: 18
		},
		{
			id: 3,
			url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
			attribution: 'Map Tiles by <a target="_blank" href="https://carto.com/attribution/">CARTO</a>',
			maxZoom: 18
		},
		{
			id: 4,
			url: "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg",
			attribution: 'Map tiles by <a target="_blank" href="http://stamen.com">Stamen Design</a>, under <a target="_blank" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_blank" href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.',
			maxZoom: 16
		},
		{
			id: 5,
			url: "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png",
			attribution: 'Map tiles by <a target="_blank" href="http://stamen.com">Stamen Design</a>, under <a target="_blank" href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a target="_blank" href="http://openstreetmap.org">OpenStreetMap</a>, under <a target="_blank" href="http://www.openstreetmap.org/copyright">ODbL</a>.',
			maxZoom: 18
		},
		{
			id: 6,
			url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png",
			attribution: '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 18
		}
	]

	handleClick = (event) => {
		const items = this.state.dataSet;
		items[event.target.id].visible = !items[event.target.id].visible;

		this.setState({
			dataSet: items,
		})
	}

	returnSvgIcon = (state) => {
		var CustomIcon = L.Icon.extend({
			options: {
				iconSize: [25, 41],
				iconAnchor: [12, 20],
				popupAnchor: [1, -34],
			}
		});

		const icon = MarkerIcon(state);
		var iconUrl = 'data:image/svg+xml;base64,' + btoa(icon);
		return new CustomIcon({
			iconUrl: iconUrl
		});

	}
	setZoom = () => {
		this.setState({
			zoom: this.map.leafletElement.getZoom()
		})
	}
	componentDidMount = () => {
		if (this.props.markers.length > 1)
			this.centerOnAllMarkers()
	}
	componentDidUpdate = (prevProps, prevState) => {
		if (prevProps.mapTheme !== this.props.mapTheme)
			this.map.leafletElement.setMaxZoom(this.layers[this.props.mapTheme].maxZoom)
	}

	centerOnAllMarkers = () => {
		this.map.leafletElement.fitBounds([...this.props.markers.map(m => m.lat && m.long ? [m.lat, m.long] : null)])
	}
	getCenter = () => {
		let center = []
		let defaultLat = parseFloat(56.2639) //Denmark,
		let defaultLng = parseFloat(9.5018) //Denmark


		if (this.props.markers.length === 1)
			center = [this.props.markers[0].lat, this.props.markers[0].long]
		else {
			center = [defaultLat, defaultLng]

		}
		return center
	}
	render() {
		const { markers, classes, theme, calibrate, mapTheme, heatData, heatMap } = this.props
		const { zoom } = this.state
		return <Fragment>
			<Map zoomControl={false} attribution={this.layers[mapTheme].attribution} ref={r => this.map = r} center={this.getCenter()} zoom={zoom} onzoomend={this.setZoom} maxZoom={this.layers[mapTheme].maxZoom} className={classes.map} >
				{heatMap ? <HeatLayer data={heatData ? heatData.map(m => ({ lat: m.lat, lng: m.long, count: m.data })) : null} /> : null}
				{heatMap ? <HeatMapLegend /> : null}
				<FullScreen />
				<ZoomControl />
				<TileLayer url={this.layers[mapTheme].url} attribution={this.layers[mapTheme].attribution} />
				{markers.map((m, i) => {
					if (m.lat && m.long)
						return <Marker
							onDragend={calibrate ? this.props.getLatLng : null}
							autoPan={calibrate ? true : false}
							draggable={calibrate ? true : false}
							position={[m.lat, m.long]}
							key={i}
							icon={this.returnSvgIcon(m.liveStatus)}>
							{calibrate ? null : <Popup className={theme.palette.type === 'dark' ? classes.popupDark : classes.popup}>
								<OpenPopup m={m} />
							</Popup>}
						</Marker>
					return null
				})}
			</Map>
		</Fragment>

	}

}
const mapStateToProps = (state) => ({
	language: state.settings.language
})

const mapDispatchToProps = {

}
export default withLeaflet(connect(mapStateToProps, mapDispatchToProps)(withStyles(mapStyles, { withTheme: true })(OpenStreetMap)))
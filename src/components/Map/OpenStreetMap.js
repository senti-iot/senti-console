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

import FullScreen from 'variables/LeafletPlugins/FullScreen'
import ZoomControl from 'variables/LeafletPlugins/ZoomControl';
import HeatLayer from 'variables/LeafletPlugins/HeatLayer';
import NewHeatMapLayer from 'variables/LeafletPlugins/NewHeatMapLayer';

class OpenStreetMap extends React.Component {
	constructor(props) {
	  super(props)
	
	  this.state = {
		 zoom: props.markers.length === 1 ? 17 : 13
	  }
	}
	
	layers = [
		{ id: 0, url: "https://tile-b.openstreetmap.fr/hot/{z}/{x}/{y}.png", label: "T1", maxZoom: 20 },
		{ id: 1, url: "https://gc2.io/mapcache/baselayers/tms/1.0.0/luftfotoserier.quickorto_2018_16cm/{z}/{x}/{-y}.png", label: "LuftPhoto", maxZoom: 18 },
		{ id: 2, url: "https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png", label: "T2", maxZoom: 18 },
		{ id: 3, url: "http://a.tile.stamen.com/toner/{z}/{x}/{y}.png", label: "T3", maxZoom: 18 },
		{ id: 4, url: "http://b.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg", label: "T4", maxZoom: 18 },
		{ id: 5, url: "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", maxZoom: 18 },
		{ id: 6, url: "https://{s}.tile.osm.org/{z}/{x}/{y}.png", attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors', maxZoom: 18 }
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
				iconAnchor: [12, 41],
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
		console.log(this.map.leafletElement.getZoomScale(), this.map.leafletElement.getZoom())
		this.setState({
			zoom: this.map.leafletElement.getZoom()
		})
	}
	componentDidMount = () => {
		if (this.props.markers.length > 1)
		  this.centerOnAllMarkers()
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
		const { markers, classes, theme, calibrate, mapTheme } = this.props
		const { zoom } = this.state
		console.log(zoom, 'render')
		return <Fragment>
			<Map zoomControl={false} ref={r => this.map = r} center={this.getCenter()} zoom={zoom} onzoomend={this.setZoom} maxZoom={this.layers[mapTheme].maxZoom} className={classes.map} >
				<NewHeatMapLayer
				/* 	fitBoundsOnLoad
					points={
						markers.map((m, i) => {
							if (m.lat && m.long)
								return [m.lat, m.long, (m.data / 100000)]
						})
					}
					longitudeExtractor={m => m[1]}
					latitudeExtractor={m => m[0]}
					intensityExtractor={m => { return parseFloat(m[2]) }}
					radius={10 * (this.layers[mapTheme].maxZoom - zoom) }
					gradient={{
						0.1: 'blue',
						0.3: 'lime',
						0.6: 'yellow',
						0.8: 'red'
					}} */
				/>
				<FullScreen />
				<ZoomControl/>
				<TileLayer url={this.layers[mapTheme].url} attribution={this.layers[mapTheme].attribution}/>
				{markers.map((m, i) => { 
					if (m.lat && m.long)
						return <Marker
							onDragend={calibrate ? this.props.getLatLng : null}
							autoPan={calibrate ? true : false}
							draggable={calibrate ? true : false}
							position={[m.lat, m.long]}
							key={i}
							icon={this.returnSvgIcon(m.liveStatus)}>
							{calibrate ? null : <Popup className={theme.palette.type === 'dark' ? classes.popupDark : classes.popup }>
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